import { Injectable } from '@angular/core';
import { QuestionType } from '../enums/questionType.enum';
import { Checkbox } from '../models/question-types/checkbox.model';
import { MultipleChoice } from '../models/question-types/multiple-choice.model';
import { Question } from '../models/question.interface';
import { Assessment } from '../models/assessment.model';
import { AssessmentConfig } from '../models/assessment-config.model';

import { ValidationResponse } from '../shared/validation-response.model';
import { ResourceLoader } from '@angular/compiler';
import { Attachment } from '../models/shared/attachment.model';
import { Upload } from '../models/question-types/upload.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // called from the validation-messages component
  // the errorMessages property is passed along with the propertyName
  // this attaches the error message to be passed back to the form field
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      // validates email pattern (this is a anguluar built in validation)
      email:
        'Must use a valid email: xxx@xxx.xxx.',

      // alpha and spaces only (custom validation)
      invalidAlpha:
        'Must be a valid name.',

      // whole numeric only allowed (custom validation)
      invalidNumbers:
        'Must be a whole number.',

      // The required length of the student Id (custom validation)
      invalidStudentIdLength:
        'Student Id requires 8 digits. If you are unsure of your student Id check with your advisor.',

      // no empty strings allowed (custom validation)
      invalidWhiteSpaceOnly:
        'Must have valid input.',

      // validates the string length (this is a anguluar built in validation)
      minlength: `Minimum length of ${validatorValue.requiredLength} required.`,

      // numeric only allowed (custom validation)
      numbersOnly:
      'Must be numeric values only.',

      // required input (this is a anguluar built in validation)
      required:
        'Required'

    };

    return config[validatorName];
  }

  // called from the component.ts where the formbuilder is created
  // ensures that value is alpha and spaces only
  static alphaValidator(control) {

    // This stops validation error messages from populating on load.
    if (control.value !== '') {
      control.markAsTouched();
    }

    // if the value does not pass validation, the property is assigned true, else null
    if (control.touched) {
      if (control.value.match(/^[\-a-zA-Z ]*$/)) {
        return null;
      } else {
        return { invalidAlpha: true };
      }
    }
  }

  // called from the component.ts where the formbuilder is created
  // validation for whole numeric value only
  static numberValidator(control) {

    // This stops validation error messages from populating on load.
    if (control.value !== '') {
      control.markAsTouched();
    }

    // if the value does not pass validation, the property is assigned true, else null
    if (control.touched) {
      if (control.value.match(/\d{1,15}/)) {
        return null;
      } else {
        return { numbersOnly: true };
      }
    }
  }

  // called from the component.ts where the formbuilder is created
  // validation for whole numeric value only
  static leadingZeros(control) {

    // This stops validation error messages from populating on load.
    if (control.value !== '') {
      control.markAsTouched();
    }

    // if the value does not pass validation, the property is assigned true, else null
    if (control.touched) {
      if (control.value.match(/^[0-9]{1,12}((\\.|,)[0-9]{0,2})?$/)) {
        return null;
      } else {
        return { numbersOnly: true };
      }
    }
  }

  // called from the component.ts where the formbuilder is created
  // validation for length of the studentId
  static studentIdLength(control) {

    // This stops validation error messages from populating on load.
    if (control.value !== '') {
      control.markAsTouched();
    }

    // if the value does not pass validation, the property is assigned true, else null
    if (control.touched) {
      if (control.value.length !== 8) {
        return { invalidStudentIdLength: true };
      } else {
        return null;
      }
    }
  }

  // called from the component.ts where the formbuilder is created
  // ensures that value is not an empty string
  static invalidWhiteSpaceOnly(control) {

    // if the value does not pass validation, the property is assigned true, else null
    if (control.touched) {
      if (!control.value.match(/^\s*$/)) {
        return null;
      } else {
        return { invalidWhiteSpaceOnly: true };
      }
    }
  }

  // ************************************************************************ //
  // ****  Validators that populate a snack bar message on submit click  **** //
  // ************************************************************************ //
  // Validation to ensure an attachment is included if has attachment is checked
  static validateAttachments(question: Question): ValidationResponse {
    const response = new ValidationResponse();
    if (question.hasAttachments) {
      if (question.attachments.length !== 0) {
        response.message = 'Attachments are uploaded and validated';
        response.result = true;
      } else {
        // tslint:disable-next-line: max-line-length
        response.message = 'You must have at least one attachment uploaded. If you do not want an attachment tied to this question, unselect the checkbox indicating that there are attachments';
        response.result = false;
      }
    } else {
      response.message = 'This question has no attachments';
      response.result = true;
    }

    return response;
  }

  // Validation to ensure a correct answer is attached to the question
  static validateCorrectAnswer(question: Upload): ValidationResponse {
    const response = new ValidationResponse();

    if (question.correctAnswer.length !== 0) {
      response.message = 'Correct Answers are uploaded and validated';
      response.result = true;
    } else {
      // tslint:disable-next-line: max-line-length
      response.message = 'You must include at least one file as the correct answer. If the answer to this question is not a file, please select a different type of question.';
      response.result = false;
    }

    return response;
  }

  // Validation to ensure a value from timer is selected if checked as timed assessment
  static validateMaxTime(config: AssessmentConfig): ValidationResponse {

    // The response object that will be returned within this function
    const response = new ValidationResponse();

    // Ensures that the max time is not still 0
    if (config.isTimed && config.maxTime === 0) {
      response.result = false;
      response.message = 'If you check this as a timed assessment you must add an appropriate maximum minute value.';
      return response;
    } else {
      response.result = true;
      response.message = 'Valid';
      return response;
    }
  }

  // Validation to ensure the wrong streak selection of assessment does not exceed number of available questions
  static validateMaxWrongStreak(assessment: Assessment): ValidationResponse {

    // The response object that will be returned within this function
    const response = new ValidationResponse();

    // Ensures that the wrong streak number is not greater than the number of questions that exist on an assessment
    if (assessment.config.wrongStreak > assessment.questionIds.length) {
      response.result = false;
      response.message = 'You currently have ' + assessment.questionIds.length + ' questions. ' +
        ' Your consective number of incorrect answers cannot exceed this amount.';
      return response;
    } else {
      response.result = true;
      response.message = 'Valid';
      return response;
    }
  }

  // Validation to ensure a question is selected before setting assessment status to complete
  static validateMinimumQuestions(assessment: Assessment): ValidationResponse {
    // These variables are set based on question type
    const minQuestionsLength = 1;

    // The response object that will be returned within this function
    const response = new ValidationResponse();

    // Make sure that there are enough total options
    if (assessment.questionIds.length < minQuestionsLength) {
      response.result = false;
      response.message = 'You must include at least ' + minQuestionsLength + ' question to save an assessment. ' +
        ' You may choose Finish Later.';
      return response;
    } else {
      response.result = true;
      response.message = 'Valid';
      return response;
    }
  }

  // Validation to ensure a that both passwords match when creating a new user
  static validatePasswordMatch(password1: any, password2: any): ValidationResponse {

    // The response object that will be returned within this function
    const response = new ValidationResponse();

    if (password1 === password2) {
      // If the passwords match, is valid
      response.result = true;
      response.message = 'Valid';
      return response;
    } else {
      // otherwise invalid
      response.result = false;
      response.message = 'Passwords do not match, please try again.';
      return response;
    }
  }

  // Validation for number of possible answers that must be selected based upon question type
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
}
