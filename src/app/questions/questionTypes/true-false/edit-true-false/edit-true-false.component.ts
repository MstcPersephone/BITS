import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { HelperService } from 'src/app/services/helper.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';
import { TrueFalse } from 'src/app/models/question-types/true-false.model';

@Component({
  selector: 'app-edit-true-false',
  templateUrl: './edit-true-false.component.html',
  styleUrls: ['./edit-true-false.component.css']
})
export class EditTrueFalseComponent implements OnInit {
  // The question being edited
  @Input() question: TrueFalse;
  // The true false edit form used to update the quesiton
  editTrueFalseForm;
  // The selected answer on the form
  selectedAnswer = '';
  // Array of possible form answers
  answers: any = [
    'True',
    'False'
  ];
  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService,
    private helperService: HelperService
  ) {
    this.editTrueFalseForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: '',
      answer: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log(this.question);
    this.editTrueFalseForm.get('questionText').setValue(this.question.questionText);
    // Pass the attachments off to the attachment service to be managed.
    if (this.question.hasAttachments) {
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
    } else {
      this.attachmentService.attachments = [];
    }

    if (this.question.answer === true) {
      this.editTrueFalseForm.get('answer').setValue('True');
    } else {
      this.editTrueFalseForm.get('answer').setValue('False');
    }
  }

  // event to handles true false value changes
  radioChangeHandler(event: any) {
    this.selectedAnswer = event.value;
  }

  // on submit function for updating the true false question
  onSubmit(formData) {
    // Initializes a new True False question to be saved
    const updatedTrueFalseQuestion: TrueFalse = new TrueFalse();

    // Calls validation on parent form controls
    // If the parent forms are invalid, submit is not allowed
    // Marks all input as touched to show errors so user knows what requires valid input
    this.questionService.handleEditQuestionFormValidation(updatedTrueFalseQuestion);
    // console.log('Points are valid', this.questionService.pointsIsValid);
    // console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    // console.log('True False From is valid', this.createTrueFalseForm.valid);

    // If the editTrueFalseForm is invalid, submit is not allowed
    // Marks all input as touched to show errors so user knows what requires valid input
    if (!this.editTrueFalseForm.valid) {
      // Runs all validation on the createTrueFalse form controls
      (Object as any).values(this.editTrueFalseForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.editTrueFalseForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid) {
      updatedTrueFalseQuestion._id = this.question._id;
      updatedTrueFalseQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
      updatedTrueFalseQuestion.hasAttachments = this.attachmentService.hasAttachments;
      updatedTrueFalseQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
      updatedTrueFalseQuestion.answer = this.helperService.convertToTrueFalse(formData.answer);
      updatedTrueFalseQuestion.isAnswered = false;
      updatedTrueFalseQuestion.studentAnswer = null;
      updatedTrueFalseQuestion.duration = 0;
      updatedTrueFalseQuestion.assessmentIds = null;

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(updatedTrueFalseQuestion as Question);

      if (attachmentResponse.result) {
        // Sends the data to the quesiton service to handle passing data for saving in database
        this.questionService.updateQuestionById(updatedTrueFalseQuestion);
      } else {
        this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
      }

      // For testing, we can remove later.
      // console.log('Question to save', updatedTrueFalseQuestion);
    }
  }
}
