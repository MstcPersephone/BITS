import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.css']
})
export class ValidationMessagesComponent {
  errorMessage: string;
  // The reference to propertyName controller
  @Input() control: FormControl;

  constructor() { }

  // If the control if touched and an error exists, the control and the errorMessage string
  // is passed to the validation service.
  // the template has directive to check for the controller reference
  // if the reference exists (true), then error message returned from validation service is displayed
  get errorMessages() {
    // tslint:disable-next-line: prefer-const
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }
    return null;
  }

}
