import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MultipleChoice } from 'src/app/models/question-types/multiple-choice.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';
import { ValidationResponse } from '../../../../shared/validation-response.model';
import { Question } from 'src/app/models/question.interface';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-create-multiple-choice',
  templateUrl: './create-multiple-choice.component.html',
  styleUrls: ['./create-multiple-choice.component.css']
})
export class CreateMultipleChoiceComponent implements OnInit, OnDestroy {
  createMultipleChoiceForm;
  isValid; // stores the validation set in the question service
  showCancelButton = false;
  showEditOption = false;

  constructor(
    public attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    public questionService: QuestionService,
    private helperService: HelperService
  ) {
    this.createMultipleChoiceForm = this.formBuilder.group({
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
    // Show the saved options
    this.showEditOption = true;

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
  onSubmit(multipleChoiceData) {
    // Initializes a new Mutiple Choice question to be saved
    const multipleChoiceQuestion: MultipleChoice = new MultipleChoice();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleCreateQuestionFormValidation(multipleChoiceData);

    // If the child create form is loaded, calls validation on the child form when submit button is clicked
    if (this.questionService.showCreateOption) {
      document.getElementById('validateOption').click();
    } else {
      // Sets question service optionIsValid to true if the create option form was never opened
      this.questionService.optionIsValid = true;
    }

    // Calls validation on the edit child form when submit button is clicked
    const options = this.questionService.getOptions();
    if (options.length > 0) {
      const optionElements = Array.from(document.getElementsByClassName('simulatedButtonMCClass'));
      optionElements.forEach((o) => {
        (o as HTMLButtonElement).click();
      });
    }

    // Calls validation on the current form when submit button is clicked
    if (!this.createMultipleChoiceForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.createMultipleChoiceForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.createMultipleChoiceForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid && this.questionService.optionIsValid) {
      multipleChoiceQuestion._id = null;
      multipleChoiceQuestion.questionText = multipleChoiceData.questionText;
      multipleChoiceQuestion.options = this.questionService.getOptions();
      multipleChoiceQuestion.hasAttachments = this.attachmentService.hasAttachments;
      multipleChoiceQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
      multipleChoiceQuestion.isAnswered = false;
      multipleChoiceQuestion.duration = 0;

      // Do a final check on options to make sure min requirements are met
      const possibleAnswersResponse = ValidationService.validatePossibleAnswers(multipleChoiceQuestion as Question);

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(multipleChoiceQuestion as Question);

      // If options are good, save the question
      // Else, throw a snackbar and stay on the page
      if (possibleAnswersResponse.result && attachmentResponse.result) {
        // Sends the data to the quesiton service to handle passing data for saving in database
        this.questionService.saveQuestion(multipleChoiceQuestion);
      } else {
        if (!possibleAnswersResponse.result) {
          this.helperService.openSnackBar(possibleAnswersResponse.message, 'OK', 'error-dialog', undefined);
        }

        if (!attachmentResponse.result) {
          this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
        }
      }
    }
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
    this.questionService.resetService();
  }
}
