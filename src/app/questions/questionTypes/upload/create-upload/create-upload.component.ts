import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Upload } from 'src/app/models/question-types/upload.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-create-upload',
  templateUrl: './create-upload.component.html',
  styleUrls: ['./create-upload.component.css']
})
export class CreateUploadComponent implements OnInit {
  createUploadForm;
  constructor(
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService,
    private questionService: QuestionService
  ) {
    this.createUploadForm = this.formBuilder.group({
      questionText: ''
    });
  }

  ngOnInit(): void {
     // Clear the attachments on init for when the form reloads
    this.attachmentService.resetAttachments();
  }

  onSubmit(uploadData) {
    const uploadQuestion: Upload = new Upload();
    uploadQuestion._id = null;
    uploadQuestion.questionText = uploadData.questionText;
    uploadQuestion.hasAttachments = true;
    uploadQuestion.attachments = this.attachmentService.getAttachments();
    uploadQuestion.isAnswered = false;
    uploadQuestion.duration = 0;
    uploadQuestion.correctAnswer = this.attachmentService.getCorrectAnswers();
    uploadQuestion.submittedAnswer = null;
    uploadQuestion.assessmentIds = null;

    this.questionService.saveQuestion(uploadQuestion);
  }
}
