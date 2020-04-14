import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Checkbox } from 'src/app/models/question-types/checkbox.model';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-checkbox',
  templateUrl: './edit-checkbox.component.html',
  styleUrls: ['./edit-checkbox.component.css']
})
export class EditCheckboxComponent implements OnInit {
  @Input() question: Question;
  isValid; // stores the validation set in the question service
  showCancelButton = false;
  editCheckboxForm;

  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService,
    private helperService: HelperService
  ) {
    this.editCheckboxForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: ''
    });
  }

  ngOnInit(): void {
    console.log(this.question);
    this.editCheckboxForm.get('questionText').setValue(this.question.questionText);
    // Pass the attachments off to the attachment service to be managed.
    if (this.question.hasAttachments) {
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
    } else {
      this.attachmentService.attachments = [];
    }
  }

  clickAdd() {
    // If the child form is loaded, calls validation on the child form when add button is clicked
    if (this.questionService.showCreateOption) {
      document.getElementById('validateOption').click();
      this.isValid = this.questionService.optionIsValid;
    }
    // sets the form to remain as visible
    this.questionService.showCreateOption = true;
    // sets the cancel button to visible
    this.showCancelButton = true;
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
    // Initializes the updated Checkbox question to be saved
    const updatedCheckboxQuestion: Checkbox = new Checkbox();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleEditQuestionFormValidation(updatedCheckboxQuestion);

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

    console.log('Points are valid', this.questionService.pointsIsValid);
    console.log('Categories are valid', this.questionService.categoriesIsValid);
    console.log('Checkbox form is valid', this.editCheckboxForm.valid);
    console.log('Create Option form is valid', this.questionService.optionIsValid);
    console.log('Edit Option has an invalid input', this.questionService.editOptionInvalid);

    // Calls validation on the current form when submit button is clicked
    if (!this.editCheckboxForm.valid) {
      // Runs all validation on the createCheckboxForm form controls
      (Object as any).values(this.editCheckboxForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.editCheckboxForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid && this.questionService.optionIsValid
      && !this.questionService.editOptionInvalid) {
      updatedCheckboxQuestion._id = this.question._id;
      updatedCheckboxQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
      updatedCheckboxQuestion.options = this.questionService.getOptions();
      updatedCheckboxQuestion.hasAttachments = this.attachmentService.hasAttachments;
      updatedCheckboxQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
      updatedCheckboxQuestion.isAnswered = false;
      updatedCheckboxQuestion.answers = null;
      updatedCheckboxQuestion.duration = 0;
      updatedCheckboxQuestion.assessmentIds = null;

      // Resets both current form and cancel button to not visible
      this.questionService.showCreateOption = false;
      this.showCancelButton = false;

      // Do a final check on options to make sure min requirements are met
      const possibleAnswersResponse = ValidationService.validatePossibleAnswers(updatedCheckboxQuestion as Question);

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(updatedCheckboxQuestion as Question);

      // If options are good, save the question
      // Else, throw a snackbar and stay on the page
      if (possibleAnswersResponse.result && attachmentResponse.result) {
        // Sends the data to the quesiton service to handle passing data for updating in database
        this.questionService.updateQuestionById(updatedCheckboxQuestion);
      } else {

        if (!possibleAnswersResponse.result) {
          this.helperService.openSnackBar(possibleAnswersResponse.message, 'OK', 'error-dialog', undefined);
        }

        if (!attachmentResponse.result) {
          this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
        }
      }

      // For testing, we can remove later
      console.log('Question to save', updatedCheckboxQuestion);
    }
  }
}
