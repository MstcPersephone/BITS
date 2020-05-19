import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, timer } from 'rxjs';
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
import { environment } from '../../environments/environment';
import { LoginEngineService } from './login.service';
import { AttachmentService } from './attachment.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AssessmentEngineService implements OnDestroy {

  public selectedTrueFalseAnswer: string;
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
  public searchParameters: string[] = [];

  // Keeping track of questions
  public currentQuestion: Question;
  public currentQuestionIndex = 0;
  private currentQuestionUpdated = new Subject<Question>();
  private running = false;
  private timerRef;
  private counter: number;

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
    public loginService: LoginEngineService,
    public attachmentService: AttachmentService,
    public dialog: MatDialog) { }

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
  async checkAnswer(question: Question) {
    console.log(question);

    switch (question.questionType) {
      case QuestionType.CheckBox:
        return await this.checkQuestionsWithOptions(question as Checkbox);
      case QuestionType.MultipleChoice:
        return await this.checkQuestionsWithOptions(question as MultipleChoice);
      case QuestionType.ShortAnswer:
        return await this.checkShortAnswer(question as ShortAnswer);
      case QuestionType.TrueFalse:
        return await this.checkTrueFalse(question as TrueFalse);
      case QuestionType.Upload:
        return await this.checkUpload(question as Upload);
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

    return new Promise((resolve, reject) => {
      resolve({ result: isCorrect });
    });
  }

  checkShortAnswer(question: ShortAnswer) {

    let isCorrect = false;
    const exactMatches = [];

    // If question is case sensetive, leave strings alone when doing the check
    if (question.isCaseSensitive) {

      // Create an array of the exact match strings
      question.matches.forEach((m) => {
        exactMatches.push(m.matchText.trim());
      });

      // Check to see if the student answer is in the exact matches string array
      if (exactMatches.includes(question.studentAnswer.trim())) {
        isCorrect = true;
      }
    } else {

      // Not case sensetive, so making everything lowercase
      question.matches.forEach((m) => {
        console.log('Exact Answer', m.matchText);
        exactMatches.push(m.matchText.trim().toLowerCase());
      });

      // Also make student answer all lower case
      if (exactMatches.includes(question.studentAnswer.trim().toLowerCase())) {
        console.log('student answer', question.studentAnswer.trim().toLowerCase());
        isCorrect = true;
      }
    }

    this.studentShortAnswer = '';

    return new Promise((resolve, reject) => {
      resolve({ result: isCorrect });
    });
  }

  // Checks to see if the student answer matches correct answer
  // Both properties are booleans
  checkTrueFalse(question: TrueFalse) {
    const isCorrect = question.studentAnswer === question.answer ? true : false;
    this.selectedTrueFalseAnswer = '';
    return new Promise((resolve, reject) => {
      resolve({ result: isCorrect });
    });
  }

  // Makes a call to the back end to extract (if necessary), store, and compare file contents
  // Returns an object that contains a true/false result
  checkUpload(question: Question) {
    (question as Upload).submittedAnswer = this.attachmentService.studentAnswers;
    this.attachmentService.studentAnswers = [];
    this.attachmentService.correctAnswers = [];
    return this.http.post(environment.apiUrl + 'assessment/checkUpload', question).toPromise();
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
    // on start assessment click starts the timer to track the students time spent on the current question
    this.startQuestionTimer();
  }

  acceptAnswer(isQuitAssessment = false) {
    const question = this.currentQuestion;


    if (question.questionType === QuestionType.ShortAnswer) {
      (question as ShortAnswer).studentAnswer = this.studentShortAnswer;
    }

    // Mark the question as being answered by the student
    question.isAnswered = isQuitAssessment ? false : true;

    // on save question click stops the timer which tracks the students time spent on the current question
    this.stopQuestionTimer();


    // Check to see if the answer is correct
    const checkResult = this.checkAnswer(question).then((val) => {
      return val;
    });

    checkResult.then((response: any) => {
      const isCorrect = response.result;
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

            // stop the rest of the function execution
            return;
          }
        }

        if (isQuitAssessment) {
          // on quit assessment click stops the timer which tracks the students time spent on the current question
          this.stopQuestionTimer();
          this.checkAssessment();

          // stop the rest of the function execution
          return;
        }

        // Go to next question
        this.goToNextQuestion();

        // Else, there are no more questions, and the assessment needs to submit
      } else {
        // on finish assessment click stops the timer which tracks the students time spent on the current question
        this.checkAssessment();
      }
    });
  }

  // Opens a confirmation dialog box to confirm the student indeed wants to quit the assessment
  quitAssessment() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Are you sure you wish to quit this assessment?',
      hasBackdrop: true,
      disableClose: true,
      closeOnNavigation: true
    });
    // On closing dialog box either call the function to archive the question or cancel the deletion
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.acceptAnswer(true);
      }
    });
  }

  // Updates the current question and notifies subscribers
  goToNextQuestion() {
    const newQuestionIndex = this.currentQuestionIndex + 1;
    this.currentQuestion = this.questions[newQuestionIndex];
    this.currentQuestionIndex = newQuestionIndex;
    this.currentQuestionUpdated.next(this.currentQuestion);
    // when a next question is loaded starts the timer to track the students time spent on the current question
    this.startQuestionTimer();
  }

  // Returns whether there are more questions to be answered
  hasQuestionsRemaining() {
    return this.questions.length !== this.currentQuestionIndex + 1 ? true : false;
  }

  // starts the timer to count down a timed test
  startTimer(duration: number) {
    const durationInMilliseconds = duration * 60000;
    setTimeout(() => {
      this.checkAssessment();
    }, durationInMilliseconds);
  }

  // starts the timer to track the students time spent on the current question
  // logic could allow for a "pause" but not currently implemented
  startQuestionTimer() {
    this.running = !this.running;
    if (this.running) {
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
      });
    }
  }

  // stops the timer which tracks the students time spent on the current question
  stopQuestionTimer() {
    if (this.currentQuestion.isAnswered) {
      this.currentQuestion.duration = this.counter;
    } else {
      this.currentQuestion.duration = 0;
    }
    console.log(this.currentQuestion.duration);

    this.running = false;
    this.counter = undefined;
  }

  // ******************************************************** //
  // ***************  API CALLS TO BACKEND  ***************** //
  // ******************************************************** //

  // ************************************************* //
  // *********  GET: TAKEN ASSESSMENT BY ID   ******** //
  // ************************************************* //
  getTakenAssessmentById(takeAssessmentId: string) {

    this.http
      .get<{ message: string, takenAssessment: TakenAssessment }>(
        environment.apiUrl + 'assessment/take/' + takeAssessmentId
      )
      .subscribe((assessmentData) => {

        console.log(assessmentData);

        this.takenAssessment = assessmentData.takenAssessment[0];
        // // mongoose always returns an array with find()
        // grabbing the first (and only) assessment in array
        this.assessment = this.takenAssessment.assessment;

        this.takenAssessmentUpdated.next(this.takenAssessment);

      });
  }

  // ***************************************************** //
  // *********   GET: FILTERED TAKEN ASSESSMENT   ******** //
  // ***************************************************** //
  getFilteredTakenAssessment(searchParameters: string[]) {
    this.helperService.isLoading = true;
    this.http
      .post<{ message: string, takenAssessments: TakenAssessment[] }>(
        environment.apiUrl + 'filterTakenAssessments/', { searchParameters })
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
    this.http.get<{ message: string, student: Student }>(environment.apiUrl + 'student/' + studentsId)
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
    this.http.post<{ message: string, student: Student }>(environment.apiUrl + 'student/save', student)
      .subscribe(
        responseData => {
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
    this.http.post<{ message: string, takenAssessmentId: string }>(environment.apiUrl + 'assessment/generate', takenAssessment)
      .subscribe(
        responseData => {
          // tslint:disable-next-line: max-line-length
          this.helperService.openSnackBar(takenAssessment.assessment.name + ' URL has been copied to clipboard!', 'Close', 'success-dialog', 5000);
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

    // populateSearchParameters so the student's records display upon updating
    const searchParameters = this.helperService.generateUniqueStudentId(student);

    console.log('In Service', student.studentId);

    this.http.post<{ message: string, updatedStudent: Student }>(environment.apiUrl + 'student/update', student)
      .subscribe(
        responseData => {
          // Success message at the bottom of the screen
          // console log information about the response for debugging
          this.helperService.openSnackBar(student.firstName + ' Updated Successfully!', 'Close', 'success-dialog', 5000);
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.updatedStudent);
          this.helperService.isLoading = false;
          // Give time for the updated student object to save to the database
          setTimeout(() => {
            this.router.navigate(['/student/list', searchParameters]);
          }, 0);
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
    this.http.post<{ message: string, updatedTakenAssessment: TakenAssessment }>(environment.apiUrl + 'assessment/updateTaken', takenAssessment)
      .subscribe(
        responseData => {
          // console log information about the response for debugging
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.updatedTakenAssessment);
          this.helperService.isLoading = false;
        },
        error => {
          // log error message from server
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  ngOnDestroy() {
    console.log('Assessment Engine SERVICE ngOnDestroy Invoked');
    this.studentShortAnswer = '';
    this.possiblePoints = 0;
    this.receivedPoints = 0;
    this.completedAssessmentScore = 0;
    this.studentPassedCurrentAssessment = false;
    this.previousScores = [];
    this.assessment = null;
    this.questions = [];
    this.wrongAnswerStreak = 0;
    this.isWrongStreak = false;
    this.maxWrongStreak = 0;
    this.isTimed = false;
    this.takenAssessments = null;
    this.takenAssessment = null;
    this.takenAssessmentId = '';
    this.currentQuestion = null;
    this.currentQuestionIndex = 0;
    this.currentStudent = null;
    this.assessmentStudent = null;
  }
}
