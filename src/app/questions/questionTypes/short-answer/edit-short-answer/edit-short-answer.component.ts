import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { HelperService } from 'src/app/services/helper.service';
import { ShortAnswer } from 'src/app/models/question-types/short-answer.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ExactMatch } from 'src/app/models/shared/exact-match.model';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-edit-short-answer',
  templateUrl: './edit-short-answer.component.html',
  styleUrls: ['./edit-short-answer.component.css']
})
export class EditShortAnswerComponent implements OnInit, OnDestroy {
  // The question being edited
  @Input() question: Question;
  isValid; // stores the validation set in the question service
  showCancelButton = false;
  // The short answer edit form which will be used to updated the question
  editShortAnswerForm;

  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService,
    public helperService: HelperService
  ) {
    this.editShortAnswerForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: '',
      isCaseSensitive: ''
    });
  }

  ngOnInit(): void {
    // Sets the form values for display
    this.editShortAnswerForm.get('questionText').setValue(this.question.questionText);
    this.editShortAnswerForm.get('hasAttachments').setValue(this.attachmentService.hasAttachments);
    this.editShortAnswerForm.get('isCaseSensitive').setValue(this.attachmentService.hasAttachments);


    // Pass the attachments off to the attachment service to be managed.
    if (this.question.hasAttachments) {
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
    } else {
      this.attachmentService.attachments = [];
    }
    // Hide the add exact match webform on load
    this.questionService.showCreateMatch = false;
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
    this.questionService.showCreateMatch = false;
    this.questionService.exactMatchIsValid = this.isValid;
  }

  // Form data passed through to update the question using the edited information
  onSubmit(formData) {

    // Initializes a new Short Answer question to be saved
    const updatedShortAnswerQuestion: ShortAnswer = new ShortAnswer();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleEditQuestionFormValidation();

    // If the child form is loaded, calls validation on the child form when submit button is clicked
    if (this.questionService.showCreateMatch) {
      document.getElementById('validateExactMatches').click();
    } else {
      // Sets question service exactMatchIsValid to true if the create form was never opened
      this.questionService.exactMatchIsValid = true;
    }

    // Calls validation on the edit child form when submit button is clicked
    // const matches = this.questionService.getMatches();
    // if (matches.length > 0) {
    const matchElements = Array.from(document.getElementsByClassName('simulatedButtonSAClass'));
    matchElements.forEach((m) => {
      (m as HTMLButtonElement).click();
    });
    // }

    // Calls validation on the current form when submit button is clicked
    if (!this.editShortAnswerForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.editShortAnswerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.editShortAnswerForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid && this.questionService.exactMatchIsValid
      && !this.questionService.editExactMatchInvalid) {

      updatedShortAnswerQuestion._id = this.question._id;
      updatedShortAnswerQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
      updatedShortAnswerQuestion.matches = this.questionService.getMatches();
      updatedShortAnswerQuestion.hasAttachments = this.attachmentService.hasAttachments;
      updatedShortAnswerQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
      updatedShortAnswerQuestion.isAnswered = false;
      updatedShortAnswerQuestion.studentAnswer = null;
      updatedShortAnswerQuestion.isCaseSensitive = this.questionService.isCaseSensitive;
      updatedShortAnswerQuestion.duration = 0;

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(updatedShortAnswerQuestion as Question);

      if (attachmentResponse.result) {
        // Sends the data to the quesiton service to handle passing data for updating in database
        this.questionService.updateQuestionById(updatedShortAnswerQuestion);
      } else {
        this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
      }

      // For testing, we can remove later.
      console.log('Question to save', updatedShortAnswerQuestion);
    }
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
    this.questionService.resetService();
  }
}
