import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HelperService } from './helper.service';
import { Student } from '../models/student.model';
import { Question } from '../models/question.interface';
import { Assessment } from '../models/assessment.model';
import { QuestionType } from '../enums/questionType.enum';
import { Checkbox } from '../models/question-types/checkbox.model';
import { MultipleChoice } from '../models/question-types/multiple-choice.model';
import { ShortAnswer } from '../models/question-types/short-answer.model';
import { TrueFalse } from '../models/question-types/true-false.model';
import { Upload } from '../models/question-types/upload.model';
import { AssessmentService } from './assessment.service';
import { TakenAssessment } from '../models/taken-assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentEngineService {

  // Students previous scores array and subject.
  public previousScores: any[];
  private previousScoresUpdated = new Subject<any[]>();

  // Keeping track of the assessment
  public assessmentStarted = false;
  private assessment: Assessment;
  private questions: Question[];
  private wrongAnswerStreak = 0;
  private isWrongStreak = false;
  private maxWrongStreak = 0;
  private isTimed = false;
  private assessmentQuestionsSubscription: Subscription;

  // Keeping track of questions
  private currentQuestion: Question;
  private currentQuestionIndex = 0;
  private currentQuestionUpdated = new Subject<Question>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private helperService: HelperService,
    private assessmentService: AssessmentService) { }

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
      this.http.post<{message: string, result: boolean}>('http://localhost:3000/api/assessment/checkUpload', question)
        .subscribe((responseData) => {
          console.log(responseData);
          return responseData.result;
        });
    }

    checkAssessment(assessment: Assessment) {
      console.log(assessment);
    }

    submitAssessment() {
      // Loop through remaining question and mark them as wrong
      // Create a new TakenAssessment object
      // Provide the properties based on values within this service
      // Make a call to save the results to TakenAssessment database
      // (will be an update as the record should already exist from getting the URL)
      // Navigate user to login page
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

  saveStudent(student: Student) {

    console.log('Student', student);

    this.http.post<{ message: string, student: Student }>('http://localhost:3000/api/student/save', student)
      .subscribe(
        responseData => {
          // tslint:disable-next-line: max-line-length
          this.helperService.openSnackBar(student.studentId + ' Saved Successfully!', 'Close', 'success-dialog', 5000);
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.student);
          // this.router.navigate(['/assessment/list']);
        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }



  prepareAssessment(assessment: Assessment) {

    this.assessment = assessment;
    this.assessmentService.getQuestionsByIds(assessment.questionIds);
    this.assessmentQuestionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
      .subscribe((questionsArray: Question[]) => {
        this.questions = questionsArray;
      });

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
    if (config.wrongStreak > 0 ) {
      this.isWrongStreak = true;
      this.maxWrongStreak = config.wrongStreak;
    }

    this.startAssessment(this.questions, this.assessment);

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

  acceptAnswer(question: Question) {

    // Mark the question as being answered by the student
    question.isAnswered = true;

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
          this.submitAssessment();

          // stop the rest of the function execution
          return;
        }
      }

      // Go to next question
      this.goToNextQuestion();

      // Else, there are no more questions, and the assessment needs to submit
    } else {
      this.submitAssessment();
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
}
