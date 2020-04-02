import { Injectable } from '@angular/core';

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
    if (!control.value.match(/^\s*$/)) {
      return null;
    } else {
      return { invalidWhiteSpaceOnly: true };
    }
  }
}
