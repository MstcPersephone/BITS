import { Injectable } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { QuestionType } from '../enums/questionType.enum';
import { Checkbox } from '../models/question-types/checkbox.model';
import { MultipleChoice } from '../models/question-types/multiple-choice.model';
import { Question } from '../models/question.interface';
import { Assessment } from '../models/assessment.model';

import { ValidationResponse } from '../shared/validation-response.model';
import { ResourceLoader } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private questionService: QuestionService) { }

  // called from the validation-messages component
  // the errorMessages property is passed along with the propertyName
  // this attaches the error message to be passed back to the form field
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      required: 'Required',
      invalidPoints: 'Must be numeric value', // whole numeric only allowed
      invalidWhiteSpaceOnly: 'Must have valid input', // no empty strings allowed
      invalidPassword:
        'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `Minimum length ${validatorValue.requiredLength}`  // validates the string length
    };

    return config[validatorName];
  }

  // called from the component.ts where the formbuilder is created
  // validation for whole numeric value only
  // if the value does not pass validation, the property is assigned true, else null
  static numberValidator(control) {
    if (control.touched) {
      if (control.value.match(/^(0|[1-9][0-9]*)$/)) {
        return null;
      } else {
        return { invalidPoints: true };
      }
    }
  }

  // called from the component.ts where the formbuilder is created
  // ensures that value is not an empty string
  // if the value does not pass validation, the property is assigned true, else null
  static invalidWhiteSpaceOnly(control) {
    if (control.touched) {
      if (!control.value.match(/^\s*$/)) {
        return null;
      } else {
        return { invalidWhiteSpaceOnly: true };
      }
    }
  }

  static validatePossibleAnswers(question: Question): ValidationResponse {
    // These variables are set based on question type
    let minOptionsLength;
    let minCorrectAnswers;
    let q;

    // The response object that will be returned within this function
    const response = new ValidationResponse();

    // Set variables based on multiple choice
    if (question.questionType === QuestionType.MultipleChoice) {
      minOptionsLength = 2;
      minCorrectAnswers = 1;
      q = question as MultipleChoice;
    }

    // Set variables based on checkbox
    if (question.questionType === QuestionType.CheckBox) {
      minOptionsLength = 3;
      minCorrectAnswers = 2;
      q = question as Checkbox;
    }

    // Make sure that there are enough total options
    if (q.options.length < minOptionsLength) {
      response.result = false;
      response.message = 'You must include at least ' + minOptionsLength + ' total answer options in the question';
      return response;
    }

    // Check to see how many correct answers there are
    let correctAnswers = 0;
    q.options.forEach((o) => {
      if (o.isAnswer) {
        correctAnswers++;
      }
    });

    // If multiple choice, correctAnswers must equal 1
    if (q.questionType === QuestionType.MultipleChoice) {
      if (correctAnswers === minCorrectAnswers) {
        response.result = true;
        response.message = 'Valid';
        return response;
      } else {
        response.result = false;
        response.message = 'You must have only have one correct answer for a Multiple Choice question';
        return response;
      }
    }

    // If checkbox, correctAnswers must be at least minimum
    if (q.questionType === QuestionType.CheckBox) {
      if (correctAnswers >= minCorrectAnswers) {
        response.result = true;
        response.message = 'Valid';
        return response;
      } else {
        response.result = false;
        response.message = 'You must have at least ' + minCorrectAnswers +
          ' correct answers for this question.  If there is only one correct answer, consider switching to a Multiple Choice question';
        return response;
      }
    }
  }

  static validateMinimumQuestions(assessment: Assessment): ValidationResponse {
    // These variables are set based on question type
    const minQuestionsLength = 1;

    // The response object that will be returned within this function
    const response = new ValidationResponse();

    // Make sure that there are enough total options
    if (assessment.questionIds.length < minQuestionsLength) {
      response.result = false;
      response.message = 'You must include at least ' + minQuestionsLength +
        ' question(s) to save an assessment, otherwise select Finish Later.';
      return response;
    } else {
      response.result = true;
      response.message = 'Valid';
      return response;
    }
  }
}
