import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation.service';
import { QuestionService } from 'src/app/services/question.service';
import { Upload } from 'src/app/models/question-types/upload.model';
import { Question } from 'src/app/models/question.interface';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-upload',
  templateUrl: './edit-upload.component.html',
  styleUrls: ['./edit-upload.component.css']
})
export class EditUploadComponent implements OnInit, OnDestroy {
  @Input() question: Upload;
  editUploadForm;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private helperService: HelperService,
    public attachmentService: AttachmentService
  ) {
    this.editUploadForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
  }

  ngOnInit(): void {
    this.editUploadForm.get('questionText').setValue(this.question.questionText);

    // Set attachments if any
    if (this.question.hasAttachments) {
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
    } else {
      this.attachmentService.attachments = [];
    }

    // Set correct answer in service
    this.attachmentService.correctAnswers = this.question.correctAnswer;
  }

  onSubmit(uploadData) {
    // Initializes a new Upload question to be saved
    const uploadQuestion: Upload = new Upload();

    // Marks all input as touched to show errors so user knows what requires valid input
    this.questionService.handleEditQuestionFormValidation();

    // Calls validation on the current form when submit button is clicked
    if (!this.editUploadForm.valid) {
      // Runs all validation on the editUpload form controls
      (Object as any).values(this.editUploadForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.editUploadForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid) {
      uploadQuestion._id = this.question._id;
      uploadQuestion.questionText = uploadData.questionText === '' ? this.question.questionText : uploadData.questionText;
      uploadQuestion.hasAttachments = this.attachmentService.hasAttachments;
      uploadQuestion.attachments = this.attachmentService.getAttachments();
      uploadQuestion.isAnswered = false;
      uploadQuestion.duration = 0;
      uploadQuestion.correctAnswer = this.attachmentService.getCorrectAnswers();
      uploadQuestion.submittedAnswer = null;

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(uploadQuestion as Question);

      const uploadAnswerResponse = ValidationService.validateCorrectAnswer(uploadQuestion);

      if (attachmentResponse.result && uploadAnswerResponse.result) {
        this.questionService.updateQuestionById(uploadQuestion);
      } else {
        if (!attachmentResponse.result) {
          this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
        }

        if (!uploadAnswerResponse.result) {
          this.helperService.openSnackBar(uploadAnswerResponse.message, 'OK', 'error-dialog', undefined);
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
