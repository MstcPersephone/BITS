import { Injectable } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { QuestionType } from '../enums/questionType.enum';
import { Checkbox } from '../models/question-types/checkbox.model';
import { MultipleChoice } from '../models/question-types/multiple-choice.model';
import { Question } from '../models/question.interface';
import { ValidationResponse } from '../shared/validation-response.model';
import { ResourceLoader } from '@angular/compiler';
import { Attachment } from '../models/shared/attachment.model';
import { Upload } from '../models/question-types/upload.model';

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
  static pointsValidator(control) {
    if (control.value.match(/^(0|[1-9][0-9]*)$/)) {
      return null;
    } else {
      return { invalidPoints: true };
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
​
    // Set variables based on multiple choice
    if (question.questionType === QuestionType.MultipleChoice) {
      minOptionsLength = 2;
      minCorrectAnswers = 1;
      q = question as MultipleChoice;
    }
​
    // Set variables based on checkbox
    if (question.questionType === QuestionType.CheckBox) {
      minOptionsLength = 3;
      minCorrectAnswers = 2;
      q = question as Checkbox;
    }
​
    // Make sure that there are enough total options
    if (q.options.length < minOptionsLength) {
      response.result = false;
      response.message = 'You must include at least ' + minOptionsLength + ' total answer options in the question';
      return response;
    }
​
    // Check to see how many correct answers there are
    let correctAnswers = 0;
    q.options.forEach((o) => {
      if (o.isAnswer) {
        correctAnswers++;
      }
    });
​
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
​
    // If checkbox, correctAnswers must be at least minimum
    if (q.questionType === QuestionType.CheckBox) {
      if (correctAnswers >= minCorrectAnswers) {
        response.result = true;
        response.message = 'Valid';
        return response;
      } else {
        response.result = false;
        response.message = 'You must have at least ' + minCorrectAnswers + ' correct answers for this question. If there is only one correct answer, consider switching to a Multiple Choice question';
        return response;
      }
    }
  }

  static validateAttachments(question: Question): ValidationResponse {
    const response = new ValidationResponse();
    if (question.hasAttachments) {
      if (question.attachments.length !== 0) {
        response.message = 'Attachments are uploaded and validated';
        response.result = true;
      } else {
        response.message = 'You must have at least one attachment uploaded. If you do not want an attachment tied to this question, unselect the checkbox indicating that there are attachments';
        response.result = false;
      }
    } else {
      response.message = 'This question has no attachments';
      response.result = true;
    }

    return response;
  }

  static validateCorrectAnswer(question: Upload): ValidationResponse {
    const response = new ValidationResponse();

    if (question.correctAnswer.length !== 0) {
      response.message = 'Correct Answers are uploaded and validated';
      response.result = true;
    } else {
      response.message = 'You must include at least one file as the correct answer. If the answer to this question is not a file, please select a different type of question.';
      response.result = false;
    }

    return response;
  }
}
