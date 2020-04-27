import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, VirtualTimeScheduler } from 'rxjs';
import { Router } from '@angular/router';
import { HelperService } from './helper.service';
import { Student } from '../models/student.model';
import { Question } from '../models/question.interface';
import { Assessment } from '../models/assessment.model';
import { TakenAssessment } from '../models/taken-assessment.model';
import { QuestionType } from '../enums/questionType.enum';
import { Checkbox } from '../models/question-types/checkbox.model';
import { MultipleChoice } from '../models/question-types/multiple-choice.model';
import { ShortAnswer } from '../models/question-types/short-answer.model';
import { TrueFalse } from '../models/question-types/true-false.model';
import { Upload } from '../models/question-types/upload.model';
import { AssessmentService } from './assessment.service';
import { LoginEngineService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class AssessmentEngineService {

  public studentShortAnswer = '';
  // Keeping track of question points and assessment score
  private possiblePoints = 0;
  private receivedPoints = 0;
  private completedAssessmentScore;
  private studentPassedCurrentAssessment = false;
  public previousScores: any[];
  private previousScoresUpdated = new Subject<any[]>();

  // Keeping track of the assessment
  public assessmentStarted = false;
  private assessment: Assessment;
  private assessmentUpdated = new Subject<Assessment>();
  public questions: Question[];
  private wrongAnswerStreak = 0;
  private isWrongStreak = false;
  private maxWrongStreak = 0;
  private isTimed = false;
  private assessmentQuestionsSubscription: Subscription;

  // Keeping track of taken assessment
  private takenAssessments: any;
  private takenAssessmentsUpdated = new Subject<any>();
  private takenAssessment: TakenAssessment;
  private takenAssessmentUpdated = new Subject<TakenAssessment>();
  private takenAssessmentId: string;
  private takenAssessmentIdUpdated = new Subject<string>();

  // Keeping track of questions
  public currentQuestion: Question;
  private currentQuestionIndex = 0;
  private currentQuestionUpdated = new Subject<Question>();

  // Keeping track of students
  private studentFormIsValid = false;
  private currentStudent: Student;
  private currentStudentUpdated = new Subject<Student>();
  private assessmentStudent: Student;
  private assessmentStudentUpdated = new Subject<Student>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private helperService: HelperService,
    private assessmentService: AssessmentService,
    public loginService: LoginEngineService) { }

  // **************************************** //
  // *********  ASSESSMENT OBJECTS  ********* //
  // **************************************** //
  getAssessmentUpdateListener() {
    return this.assessmentUpdated.asObservable();
  }

  getTakenAssessmentIdUpdateListener() {
    return this.takenAssessmentIdUpdated.asObservable();
  }

  getTakenAssessmentUpdateListener() {
    return this.takenAssessmentUpdated.asObservable();
  }

  getTakenAssessmentsUpdateListener() {
    return this.takenAssessmentsUpdated.asObservable();
  }

  // ********************************************** //
  // *********  ASSESSMENT: SCORING   ********* //
  // ********************************************** //
  checkAnswer(question: Question) {
    console.log(question);

    switch (question.questionType) {
      case QuestionType.CheckBox:
        return this.checkQuestionsWithOptions(question as Checkbox);
      case QuestionType.MultipleChoice:
        return this.checkQuestionsWithOptions(question as MultipleChoice);
      case QuestionType.ShortAnswer:
        return this.checkShortAnswer(question as ShortAnswer);
      case QuestionType.TrueFalse:
        return this.checkTrueFalse(question as TrueFalse);
      case QuestionType.Upload:
        return this.checkUpload(question as Upload);
    }
  }

  // Checks Answers for Checkbox and MultipleChoice because they both use Options
  checkQuestionsWithOptions(question: Checkbox | MultipleChoice) {

    // The answer is correct until proven otherwise
    let isCorrect = true;

    // Loop through all options in the question
    question.options.forEach((o) => {

      // If it is a correct answer, make sure the student selected it
      if (o.isAnswer) {
        if (!o.optionIsSelected) {
          isCorrect = false;

        }
        // Make sure student did not select any wrong answers
      } else {
        if (o.optionIsSelected) {
          isCorrect = false;
        }
      }
    });

    return isCorrect;
  }

  checkShortAnswer(question: ShortAnswer) {

    // TODO: add space checks for validation
    let isCorrect = false;
    const exactMatches = [];

    // If question is case sensetive, leave strings alone when doing the check
    if (question.isCaseSensitive) {

      // Create an array of the exact match strings
      question.matches.forEach((m) => {
        exactMatches.push(m.matchText);
      });

      // Check to see if the student answer is in the exact matches string array
      if (exactMatches.includes(question.studentAnswer)) {
        isCorrect = true;
      }
    } else {

      // Not case sensetive, so making everything lowercase
      question.matches.forEach((m) => {
        exactMatches.push(m.matchText.toLowerCase());
      });

      // Also make student answer all lower case
      if (exactMatches.includes(question.studentAnswer.toLowerCase)) {
        isCorrect = true;
      }
    }

    return isCorrect;
  }

  // Checks to see if the student answer matches correct answer
  // Both properties are booleans
  checkTrueFalse(question: TrueFalse) {
    return question.studentAnswer === question.answer ? true : false;
  }

  // Makes a call to the back end to extract (if necessary), store, and compare file contents
  // Returns an object that contains a true/false result
  checkUpload(question: Question) {
    console.log(question);
    this.http.post<{ message: string, result: boolean }>('http://localhost:3000/api/assessment/checkUpload', question)
      .subscribe((responseData) => {
        console.log(responseData);
        return responseData.result;
      });
  }

  getPossiblePoints(points: number) {
    return this.possiblePoints += points;
  }

  getReceivedPoints(points: number) {
    return this.receivedPoints += points;
  }

  checkAssessment() {
    this.assessmentStarted = false;
    const questions = this.questions;

    // Loop through all the questions
    questions.forEach(q => {
      // If the student hit the quit button
      if (!q.isAnswered) {
        // assign incorrect answer
        q.isAnsweredCorrectly = false;
        // track the possible points but don't give student point credits
        this.getPossiblePoints(q.points);
      } else {
        // When the student has answered this question, also get the possible points
        this.getPossiblePoints(q.points);
        if (q.isAnsweredCorrectly) {
          // Only if they answered the question correctly then give them point credits
          this.getReceivedPoints(q.points);
        }
      }
    });

    // Calculate the student's assessment score
    // this.completedAssessmentScore = this.receivedPoints / this.possiblePoints * 100;
    const pointScore: any = Number(this.receivedPoints / this.possiblePoints).toFixed(4);
    console.log('point score', pointScore);

    this.completedAssessmentScore = (pointScore * 100).toFixed(2);

    // Validate if student has passed the assessment
    if (this.completedAssessmentScore < this.assessment.config.minimumScore) {
      // If their score is less than the min passing score they have failed
      this.studentPassedCurrentAssessment = false;
    } else {
      // Otherwise they have passed
      this.studentPassedCurrentAssessment = true;
    }

    console.log('Student Passed', this.studentPassedCurrentAssessment);
    // call to function that will add all property values to the taken assessment
    this.submitAssessment();
  }

  submitAssessment() {
    // Still need to take care of timed assessment function.
    // Some way to reset the values within this service
    // Some way of hiding the Menu button in the header when loading the taken assessment url.

    // Add the questions to the students taken assessment with answers included
    this.takenAssessment.questions = this.questions;
    // Add the students score to the taken assessment
    console.log('prescore', this.completedAssessmentScore);
    this.takenAssessment.score = parseFloat(this.completedAssessmentScore);
    console.log('postscore', this.takenAssessment.score);
    // Add the student's passing status to the taken assessment
    this.takenAssessment.studentPassed = this.studentPassedCurrentAssessment;

    console.log('The Students Completed Assessment', this.takenAssessment);
    // Pass the taken assessment to be updated in the database
    this.updateTakenAssessment(this.takenAssessment);
  }

  // ********************************************** //
  // **************  STUDENT OBJECT  ************** //
  // ********************************************** //

  getCurrentStudentUpdateListener() {
    return this.currentStudentUpdated.asObservable();
  }

  getAssessmentStudentUpdateListener() {
    return this.assessmentStudentUpdated.asObservable();
  }

  // ********************************************** //
  // *********  STUDENT: FORM VALIDATION  ********* //
  // ********************************************** //

  setStudentFormIsValid(isValid: boolean) {
    this.studentFormIsValid = isValid;
  }

  getStudentFormIsValid() {
    return this.studentFormIsValid;
  }

  // ********************************************** //
  // *********  STUDENT: PREVIOUS SCORES  ********* //
  // ********************************************** //

  // gets the minimum score set by user in configuration
  getPreviousScores() {
    return null;
  }

  getpreviousScoresUpdatedListener() {
    return this.previousScoresUpdated.asObservable();
  }

  getCurrentQuestionUpdatedListener() {
    return this.currentQuestionUpdated.asObservable();
  }

  prepareAssessment(assessment: Assessment) {
    this.assessment = assessment;
    this.assessmentService.getQuestionsByIds(assessment.questionIds);
    this.assessmentQuestionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
      .subscribe((questionsArray: Question[]) => {
        this.questions = questionsArray;
        console.log('QUESTIONS', this.questions);

        // The rest of the prep work is dependent on getting these questions
        // Put config into its own variable
        const config = assessment.config;

        // Get timer ready to start if necessary
        if (config.isTimed) {
          // Starting timer with setTimeout to make sure it starts last
          setTimeout(() => {
            this.startTimer(config.maxTime);
          }, 0);
        }

        // Randomize questions if needed
        if (config.isRandom) {
          this.questions = this.randomizeQuestions(this.questions);
        }

        // Set up and trigger wrong streak if needed
        if (config.wrongStreak > 0) {
          this.isWrongStreak = true;
          this.maxWrongStreak = config.wrongStreak;
        }

        this.startAssessment(this.questions, this.assessment);
      });
  }

  randomizeQuestions(questions) {
    let currentIndex = questions.length;
    let tempValue: number;
    let randomIndex: number;

    // While there are remaining questions left to randomize
    while (currentIndex !== 0) {
      // Pick a random question
      randomIndex = Math.floor(Math.random() * currentIndex);

      currentIndex -= 1;

      // Assign current question to temp variable
      tempValue = questions[currentIndex];

      // Swap random question with current question
      questions[currentIndex] = questions[randomIndex];
      questions[randomIndex] = tempValue;
    }

    return questions;
  }

  startAssessment(questions: Question[], assessment: Assessment) {
    this.currentQuestion = questions[0];
    this.assessmentStarted = true;
  }

  acceptAnswer(isQuitAssessment = false) {

    const question = this.currentQuestion;

    if (question.questionType === QuestionType.ShortAnswer) {
      (question as ShortAnswer).studentAnswer = this.studentShortAnswer;
    }

    // Mark the question as being answered by the student
    question.isAnswered = isQuitAssessment ? false : true;

    // Check to see if the answer is correct
    const isCorrect = this.checkAnswer(question);

    // If the answer is correct
    if (isCorrect) {

      // Mark the question as having a correct answer
      question.isAnsweredCorrectly = true;

      // If the answer is wrong
    } else {
      // Mark the question object as having the wrong answer
      question.isAnsweredCorrectly = false;
    }

    // Update the submitted question in the array so it can be saved when submitting
    this.questions[this.currentQuestionIndex] = question;

    // const hasQuestionsRemaining = true;
    // this.hasQuestionsRemaining();

    // Check to see if there are more questions
    if (this.hasQuestionsRemaining()) {

      // Reset wrong streak
      if (this.isWrongStreak && isCorrect) {
        this.wrongAnswerStreak = 0;

        // Or increase wrong streak
      } else if (this.isWrongStreak && !isCorrect) {
        this.wrongAnswerStreak++;

        // Check to see if max wrong streak is reached
        if (this.wrongAnswerStreak === this.maxWrongStreak) {
          this.checkAssessment();

          alert('Hit the wrong streak');

          // stop the rest of the function execution
          return;
        }
      }

      if (isQuitAssessment) {
        this.checkAssessment();

        alert('Quit assessment button clicked');

        // stop the rest of the function execution
        return;
      }

      // Go to next question
      this.goToNextQuestion();

      // Else, there are no more questions, and the assessment needs to submit
    } else {
      this.checkAssessment();
    }
  }

  // Updates the current question and notifies subscribers
  goToNextQuestion() {
    const newQuestionIndex = this.currentQuestionIndex + 1;
    this.currentQuestion = this.questions[newQuestionIndex];
    this.currentQuestionIndex = newQuestionIndex;
    this.currentQuestionUpdated.next(this.currentQuestion);
  }

  // Returns whether there are more questions to be answered
  hasQuestionsRemaining() {
    return this.questions.length !== this.currentQuestionIndex + 1 ? true : false;
  }

  startTimer(duration: number) {
    // timer logic
  }

  // ******************************************************** //
  // ***************  API CALLS TO BACKEND  ***************** //
  // ******************************************************** //

  // ************************************************* //
  // *********  GET: TAKEN ASSESSMENT BY ID   ******** //
  // ************************************************* //
  getTakenAssessmentById(takeAssessmentId: string) {
    this.helperService.isLoading = true;
    this.http
      .get<{ message: string, takenAssessment: TakenAssessment }>(
        'http://localhost:3000/api/assessment/take/' + takeAssessmentId
      )
      .subscribe((assessmentData) => {

        console.log(assessmentData);

        this.takenAssessment = assessmentData.takenAssessment[0];
        // // mongoose always returns an array with find()
        // grabbing the first (and only) assessment in array
        this.assessment = this.takenAssessment.assessment;

        // // Subscribers get a copy of the assessment.
        // this.assessmentUpdated.next(this.assessment);

        this.takenAssessmentUpdated.next(this.takenAssessment);

        // Done loading. Remove the loading spinner
        this.helperService.isLoading = false;
      });
  }

  // ***************************************************** //
  // *********   GET: FILTERED TAKEN ASSESSMENT   ******** //
  // ***************************************************** //
  getFilteredTakenAssessment(searchParameters: string[]) {
    this.helperService.isLoading = true;
    this.http
      .post<{ message: string, takenAssessments: TakenAssessment[] }>(
        'http://localhost:3000/api/filterTakenAssessments/', { searchParameters })
      .subscribe(
        responseData => {
          this.takenAssessments = responseData.takenAssessments;
          this.takenAssessmentsUpdated.next(this.takenAssessments);
          // Done loading. Remove the loading spinner
          this.helperService.isLoading = false;
          console.log(responseData.message);
          console.log(this.takenAssessments);
        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  // ************************************************* //
  // *************  GET: STUDENT BY ID  ************** //
  // ************************************************* //
  getStudentbyId(studentsId: string) {
    this.helperService.isLoading = true;
    this.http.get<{ message: string, student: Student }>('http://localhost:3000/api/student/' + studentsId)
      .subscribe((studentData) => {
        this.currentStudent = studentData.student[0];
        this.currentStudentUpdated.next(this.currentStudent);
        this.helperService.isLoading = false;
      });
  }

  // ************************************************* //
  // ***************  SAVE: STUDENT  ***************** //
  // ************************************************* //
  saveStudent(student: Student) {
    // API call to backend to add student to database
    this.http.post<{ message: string, student: Student }>('http://localhost:3000/api/student/save', student)
      .subscribe(
        responseData => {
          // tslint:disable-next-line: max-line-length
          this.helperService.openSnackBar(student.uniqueStudentIdentifier + ' Saved Successfully!', 'Close', 'success-dialog', 5000);
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.student);
          console.log(responseData.student._id);
          this.assessmentStudent = responseData.student;
          this.assessmentStudentUpdated.next(this.assessmentStudent);
        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  // ********************************************************** //
  // ***************  SAVE: TAKEN ASSESSMENT  ***************** //
  // ********************************************************** //
  saveTakenAssessment(takenAssessment: TakenAssessment) {
    console.log('Taken Assessment', takenAssessment);
    // API call to backend to create a taken assessment record to pass assessment engine data to
    this.http.post<{ message: string, takenAssessmentId: string }>('http://localhost:3000/api/assessment/generate', takenAssessment)
      .subscribe(
        responseData => {
          // tslint:disable-next-line: max-line-length
          this.helperService.openSnackBar(takenAssessment.assessment.name + ' URL has been created!', 'Close', 'success-dialog', 5000);
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData);
          // The taken assessment id to be used to generate url
          this.takenAssessmentId = responseData.takenAssessmentId;
          this.takenAssessmentIdUpdated.next(this.takenAssessmentId);
        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  // ************************************************* //
  // **************  UPDATE: STUDENT  **************** //
  // ************************************************* //
  updateStudent(student: Student) {
    // isLoading is used to add a spinner
    this.helperService.isLoading = true;

    console.log('In Service', student.studentId);

    // tslint:disable-next-line: max-line-length
    this.http.post<{ message: string, updatedStudent: Student }>('http://localhost:3000/api/student/update', student)
      .subscribe(
        responseData => {
          // Success message at the bottom of the screen
          // console log information about the response for debugging
          this.helperService.openSnackBar(student.firstName + ' Updated Successfully!', 'Close', 'success-dialog', 5000);
          this.helperService.isLoading = false;
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.updatedStudent);
          this.router.navigate(['/student/list']);
        },
        error => {
          // log error message from server
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  // ********************************************************** //
  // **************  UPDATE: TAKEN ASSESSMENT  **************** //
  // ********************************************************** //
  updateTakenAssessment(takenAssessment: TakenAssessment) {
    // isLoading is used to add a spinner
    this.helperService.isLoading = true;

    console.log('Updated Taken Assessment', takenAssessment);

    // tslint:disable-next-line: max-line-length
    this.http.post<{ message: string, updatedTakenAssessment: TakenAssessment }>('http://localhost:3000/api/assessment/updateTaken', takenAssessment)
      .subscribe(
        responseData => {
          // Success message at the bottom of the screen
          // console log information about the response for debugging
          this.helperService.openSnackBar(takenAssessment.assessment.name + ' Updated Successfully!', 'Close', 'success-dialog', 5000);
          this.helperService.isLoading = false;
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.updatedTakenAssessment);
          console.table(responseData.updatedTakenAssessment);
          if (this.takenAssessment.studentPassed !== null) {
            this.loginService.logout();
        }
        },
        error => {
          // log error message from server
          console.log('%c' + error.error.message, 'color: red;');
        });
  }
}
