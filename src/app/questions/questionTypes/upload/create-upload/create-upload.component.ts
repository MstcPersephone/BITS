import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Upload } from 'src/app/models/question-types/upload.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Question } from 'src/app/models/question.interface';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-create-upload',
  templateUrl: './create-upload.component.html',
  styleUrls: ['./create-upload.component.css']
})
export class CreateUploadComponent implements OnInit, OnDestroy {
  createUploadForm;
  constructor(
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService,
    private questionService: QuestionService,
    private helperService: HelperService
  ) {
    this.createUploadForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
  }

  ngOnInit(): void {
    // Clear the attachments on init for when the form reloads
    this.attachmentService.resetAttachments();
  }

  onSubmit(uploadData) {
    // Initializes a new Upload question to be saved
    const uploadQuestion: Upload = new Upload();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleCreateQuestionFormValidation(uploadQuestion);

    // console.log('Points are valid', this.questionService.pointsIsValid);
    // console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    // console.log('True False From is valid', this.createTrueFalseForm.valid);

    // Calls validation on the current form when submit button is clicked
    if (!this.createUploadForm.valid) {
      // Runs all validation on the createTrueFalse form controls
      (Object as any).values(this.createUploadForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.createUploadForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid) {
      uploadQuestion._id = null;
      uploadQuestion.questionText = uploadData.questionText;
      uploadQuestion.hasAttachments = this.attachmentService.hasAttachments;
      uploadQuestion.attachments = this.attachmentService.getAttachments();
      uploadQuestion.isAnswered = false;
      uploadQuestion.duration = 0;
      uploadQuestion.correctAnswer = this.attachmentService.getCorrectAnswers();
      uploadQuestion.submittedAnswer = null;
      uploadQuestion.assessmentIds = null;

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(uploadQuestion as Question);

      const uploadAnswerResponse = ValidationService.validateCorrectAnswer(uploadQuestion);

      if (attachmentResponse.result && uploadAnswerResponse.result) {
        this.questionService.saveQuestion(uploadQuestion);
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
  }
}
