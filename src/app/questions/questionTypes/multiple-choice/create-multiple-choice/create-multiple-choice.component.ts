import { Component, OnInit } from '@angular/core';
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
export class CreateMultipleChoiceComponent implements OnInit {
  createMultipleChoiceForm;
  isValid; // stores the validation set in the question service
  showCancelButton = false;

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
    this.questionService.showCreateOption = true;
    this.questionService.options = [];
  }

  clickAdd() {
    // // If the child form is loaded, calls validation on the child form when add button is clicked
    if (this.questionService.showCreateOption) {
      document.getElementById('validateOption').click();
      this.isValid = this.questionService.optionIsValid;
    }
    // // sets the form to remain as visible
    this.questionService.showCreateOption = true;
    // // sets the cancel button to visible
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
    this.questionService.optionIsValid = this.isValid;
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(multipleChoiceData) {
    // Initializes a new Mutiple Choice question to be saved
    const multipleChoiceQuestion: MultipleChoice = new MultipleChoice();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleCreateQuestionFormValidation(multipleChoiceData);

    // If the child form is loaded, calls validation on the child form when submit button is clicked
    if (this.questionService.showCreateOption) {
      document.getElementById('validateOption').click();
    }

    // console.log('Points are valid', this.questionService.pointsIsValid);
    // console.log('Categories are valid', this.questionService.categoriesIsValid);
    // console.log('Multiple Choice form is valid', this.createMultipleChoiceForm.valid);
    // console.log('Option form is valid', this.questionService.optionIsValid);

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
      multipleChoiceQuestion.assessmentIds = null;

      // Do a final check on options to make sure min requirements are met
      const response = ValidationService.validatePossibleAnswers(multipleChoiceQuestion as Question);

      // If options are good, save the question
      // Else, throw a snackbar and stay on the page
      if (response.result) {
        // Sends the data to the quesiton service to handle passing data for saving in database
        this.questionService.saveQuestion(multipleChoiceQuestion);
      } else {
        this.helperService.openSnackBar(response.message, 'OK', 'error-dialog', undefined);
      }

      // For testing, we can remove later.
      // console.log(multipleChoiceQuestion);
    }
  }
}
