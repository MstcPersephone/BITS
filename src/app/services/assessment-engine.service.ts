import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class AssessmentEngineService {

  // Students previous scores array and subject.
  public previousScores: any[];
  private previousScoresUpdated = new Subject<any[]>();
  public assessmentStarted = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private helperService: HelperService) { }

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
}
