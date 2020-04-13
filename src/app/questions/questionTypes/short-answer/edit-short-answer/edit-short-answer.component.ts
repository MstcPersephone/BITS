import { Component, OnInit, Input } from '@angular/core';
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
export class EditShortAnswerComponent implements OnInit {
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
    // console.log(this.question);
    this.editShortAnswerForm.get('questionText').setValue(this.question.questionText);
    // Pass the attachments off to the attachment service to be managed.
    if (this.question.hasAttachments) {
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
    } else {
      this.attachmentService.attachments = [];
    }
    this.questionService.showCreateMatch = false;
  }

  clickAdd() {
    // If the child form is loaded, calls validation on the child form when add button is clicked
    if (this.questionService.showCreateMatch) {
      document.getElementById('validateExactMatches').click();
      this.isValid = this.questionService.exactMatchIsValid;
    }
    // sets the form to remain as visible
    this.questionService.showCreateMatch = true;
    // sets the cancel button to visible
    this.showCancelButton = true;
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
    this.questionService.handleEditQuestionFormValidation(updatedShortAnswerQuestion);

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

    console.log('Points are valid', this.questionService.pointsIsValid);
    console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    console.log('Sort Answer form is valid', this.editShortAnswerForm.valid);
    console.log('Exact Match form is valid', this.questionService.exactMatchIsValid);
    console.log('Edit Exact Match has an invalid input', this.questionService.editExactMatchInvalid);

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
      updatedShortAnswerQuestion.assessmentIds = null;

      // Resets both current form and cancel button to not visible
      this.questionService.showCreateMatch = false;
      this.showCancelButton = false;

      // Sends the data to the quesiton service to handle passing data for updating in database
      this.questionService.updateQuestionById(updatedShortAnswerQuestion);

      // For testing, we can remove later.
      console.log('Question to save', updatedShortAnswerQuestion);
    }
  }
}
