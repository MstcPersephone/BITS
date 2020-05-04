import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ShortAnswer } from 'src/app/models/question-types/short-answer.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Question } from 'src/app/models/question.interface';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-create-short-answer',
  templateUrl: './create-short-answer.component.html',
  styleUrls: ['./create-short-answer.component.css']
})
export class CreateShortAnswerComponent implements OnInit, OnDestroy {
  // The form object
  createShortAnswerForm;
  isValid; // stores the validation set in the question service
  showCancelButton = false;
  @Input() caseSensitive;

  constructor(
    private formBuilder: FormBuilder,
    public questionService: QuestionService,
    public attachmentService: AttachmentService,
    private helperService: HelperService
  ) {
    this.createShortAnswerForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: '',
      isCaseSensitive: ''
    });
  }

  ngOnInit(): void {
    // Clear the attachments on init for when the form reloads
    this.attachmentService.resetAttachments();
    // show the exact match webform on load
    this.questionService.showCreateMatch = true;
    this.questionService.exactMatches = [];
  }

  clickAdd() {
    // Will call validation when the exact match webform is visible
    if (this.questionService.showCreateMatch) {
      document.getElementById('validateExactMatches').click();
      this.isValid = this.questionService.exactMatchIsValid;

      if (this.isValid) {
        // If the form passed validation hide the form and the cancel button
        this.showCancelButton = false;
        this.questionService.showCreateMatch = false;
      }

    } else {
      // If the webform is invalid, keep form and cancel button visible.
      this.questionService.showCreateMatch = true;
      this.showCancelButton = true;
    }
  }

  clickCancel() {
    // Hides the form and the cancel button
    // restores previous validity on the exact match to allow saving on submit
    const matches = this.questionService.getMatches();
    if (matches.length > 0) {
      this.questionService.showCreateMatch = false;
    }
    this.showCancelButton = false;
    this.questionService.exactMatchIsValid = this.isValid;
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(questionData) {
    // Initializes a new Short Answer question to be saved
    const shortAnswerQuestion: ShortAnswer = new ShortAnswer();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleCreateQuestionFormValidation(shortAnswerQuestion);

    // If the child form is loaded, calls validation on the child form when submit button is clicked
    if (this.questionService.showCreateMatch) {
      document.getElementById('validateExactMatches').click();
    }
    // console.log('Points are valid', this.questionService.pointsIsValid);
    // console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    // console.log('Sort Answer form is valid', this.createShortAnswerForm.valid);
    // console.log('Exact Match form is valid', this.questionService.exactMatchIsValid);

    // Calls validation on the current form when submit button is clicked
    if (!this.createShortAnswerForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.createShortAnswerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms are valid, data will be passed to question service for saving
    if (this.createShortAnswerForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid && this.questionService.exactMatchIsValid) {
      shortAnswerQuestion._id = null;
      shortAnswerQuestion.questionText = questionData.questionText;
      shortAnswerQuestion.hasAttachments = this.attachmentService.hasAttachments;
      shortAnswerQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
      shortAnswerQuestion.isAnswered = false;
      shortAnswerQuestion.studentAnswer = null;
      shortAnswerQuestion.matches = this.questionService.getMatches();
      shortAnswerQuestion.assessmentIds = null;
      shortAnswerQuestion.isCaseSensitive = this.questionService.isCaseSensitive;
      shortAnswerQuestion.duration = 0;

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(shortAnswerQuestion as Question);

      if (attachmentResponse.result) {
        // Sends the data to the quesiton service to handle passing data for saving in database
        this.questionService.saveQuestion(shortAnswerQuestion);

        // Resets both current form and cancel button to not visible
        this.questionService.showCreateMatch = false;
        this.showCancelButton = false;

      } else {
        this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
      }

      // For testing, we can remove later.
      // console.log('Question to save', shortAnswerQuestion);
    }
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
    this.questionService.resetService();
  }
}
