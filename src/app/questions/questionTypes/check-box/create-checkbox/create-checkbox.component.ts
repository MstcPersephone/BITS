import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Checkbox } from 'src/app/models/question-types/checkbox.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';
import { HelperService } from 'src/app/services/helper.service';
import { Question } from 'src/app/models/question.interface';

@Component({
  selector: 'app-create-checkbox',
  templateUrl: './create-checkbox.component.html',
  styleUrls: ['./create-checkbox.component.css']
})
export class CreateCheckboxComponent implements OnInit {
  createCheckboxForm;
  isValid; // stores the validation set in the question service
  showCancelButton = false;

  constructor(
    public attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    public questionService: QuestionService,
    private helperService: HelperService
  ) {
    this.createCheckboxForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: ''
    });
  }

  ngOnInit(): void {
    // Clear the attachments on init for when the form reloads
    this.attachmentService.resetAttachments();
    // show the option webform on load
    this.questionService.showCreateOption = true;
    this.questionService.options = [];
  }

  clickAdd() {
    // Will call validation when the option webform is visible
    if (this.questionService.showCreateOption) {
      document.getElementById('validateOption').click();
      this.isValid = this.questionService.optionIsValid;

      if (this.isValid) {
        // If the form passed validation hide the form and the cancel button
        this.showCancelButton = false;
        this.questionService.showCreateOption = false;
      }
    } else {
      // If the webform is invalid, keep form and cancel button visible.
      this.questionService.showCreateOption = true;
      this.showCancelButton = true;
    }
  }

  clickCancel() {
    // Hides the form and the cancel button
    // restores previous validity on the option to allow saving on submit
    const options = this.questionService.getOptions();
    if (options.length > 0) {
      this.questionService.showCreateOption = false;
    }
    this.showCancelButton = false;
    this.questionService.optionIsValid = this.isValid;
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(checkboxData) {
    // Initializes a new Checkbox question to be saved
    const checkboxQuestion: Checkbox = new Checkbox();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleCreateQuestionFormValidation(checkboxQuestion);

    // If the child form is loaded, calls validation on the child form when submit button is clicked
    if (this.questionService.showCreateOption) {
      document.getElementById('validateOption').click();
    }

    console.log('Points are valid', this.questionService.pointsIsValid);
    console.log('Categories are valid', this.questionService.categoriesIsValid);
    console.log('Checkbox form is valid', this.createCheckboxForm.valid);
    console.log('Option form is valid', this.questionService.optionIsValid);

    // Calls validation on the current form when submit button is clicked
    if (!this.createCheckboxForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.createCheckboxForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.createCheckboxForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid && this.questionService.optionIsValid) {
      checkboxQuestion._id = null;
      checkboxQuestion.questionText = checkboxData.questionText;
      checkboxQuestion.options = this.questionService.getOptions();
      checkboxQuestion.hasAttachments = this.attachmentService.hasAttachments;
      checkboxQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
      checkboxQuestion.isAnswered = false;
      checkboxQuestion.duration = 0;

      // Do a final check on options to make sure min requirements are met
      const possibleAnswersResponse = ValidationService.validatePossibleAnswers(checkboxQuestion as Question);

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(checkboxQuestion as Question);

      // If options are good, save the question
      // Else, throw a snackbar and stay on the page
      if (possibleAnswersResponse.result && attachmentResponse.result) {
        // Sends the data to the quesiton service to handle passing data for saving in database
        this.questionService.saveQuestion(checkboxQuestion);
      } else {

        if (!possibleAnswersResponse.result) {
          this.helperService.openSnackBar(possibleAnswersResponse.message, 'OK', 'error-dialog', undefined);
        }

        if (!attachmentResponse.result) {
          this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
        }
      }

      // For testing, we can remove later.
      console.log(checkboxQuestion);
    }
  }
}
