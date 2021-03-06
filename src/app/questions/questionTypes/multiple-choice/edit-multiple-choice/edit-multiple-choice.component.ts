import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';
import { MultipleChoice } from 'src/app/models/question-types/multiple-choice.model';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-multiple-choice',
  templateUrl: './edit-multiple-choice.component.html',
  styleUrls: ['./edit-multiple-choice.component.css']
})
export class EditMultipleChoiceComponent implements OnInit, OnDestroy {
  @Input() question: Question;
  isValid; // stores the validation set in the question service
  showCancelButton = false;
  editMultipleChoiceForm;

  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService,
    private helperService: HelperService
  ) {
    this.editMultipleChoiceForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: ''
    });
  }

  ngOnInit(): void {
    // Sets the value of the form fields
    this.editMultipleChoiceForm.get('questionText').setValue(this.question.questionText);
    this.editMultipleChoiceForm.get('hasAttachments').setValue(this.attachmentService.hasAttachments);

    // Pass the attachments off to the attachment service to be managed.
    if (this.question.hasAttachments) {
      // If the form passed validation hide the form and the cancel button
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
    } else {
      this.attachmentService.attachments = [];
    }
    // Hide the add option webform on load
    this.questionService.showCreateOption = false;
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
    this.questionService.showCreateOption = false;
    this.questionService.optionIsValid = this.isValid;
  }

  onSubmit(formData) {
    // Initializes the updated Mutiple Choice question to be saved
    const updatedMultipleChoiceQuestion: MultipleChoice = new MultipleChoice();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleEditQuestionFormValidation();

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
    if (!this.editMultipleChoiceForm.valid) {
      // Runs all validation on the createMultipleChoiceForm form controls
      (Object as any).values(this.editMultipleChoiceForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.editMultipleChoiceForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid && this.questionService.optionIsValid
      && !this.questionService.editOptionInvalid) {
      updatedMultipleChoiceQuestion._id = this.question._id;
      updatedMultipleChoiceQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
      updatedMultipleChoiceQuestion.options = this.questionService.getOptions();
      updatedMultipleChoiceQuestion.hasAttachments = this.attachmentService.hasAttachments;
      updatedMultipleChoiceQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
      updatedMultipleChoiceQuestion.isAnswered = false;
      updatedMultipleChoiceQuestion.duration = 0;

      // Resets both current form and cancel button to not visible
      this.questionService.showCreateOption = false;
      this.showCancelButton = false;

      // Do a final check on options to make sure min requirements are met
      const possibleAnswersResponse = ValidationService.validatePossibleAnswers(updatedMultipleChoiceQuestion as Question);

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(updatedMultipleChoiceQuestion as Question);

      // If options are good, save the question
      // Else, throw a snackbar and stay on the page
      if (possibleAnswersResponse.result && attachmentResponse.result) {
        // Sends the data to the quesiton service to handle passing data for updating in database
        this.questionService.updateQuestionById(updatedMultipleChoiceQuestion);
      } else {
        if (!possibleAnswersResponse.result) {
          this.helperService.openSnackBar(possibleAnswersResponse.message, 'OK', 'error-dialog', undefined);
        }

        if (!attachmentResponse) {
          this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
        }
      }

      // For testing, we can remove later.
      console.log('Question to save', updatedMultipleChoiceQuestion);
    }
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
    this.questionService.resetService();
  }

}
