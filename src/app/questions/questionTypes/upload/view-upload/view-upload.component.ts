import { Component, OnInit, Input } from '@angular/core';
import { Upload } from 'src/app/models/question-types/upload.model';
import { FormBuilder } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'app-view-upload',
  templateUrl: './view-upload.component.html',
  styleUrls: ['./view-upload.component.css']
})
export class ViewUploadComponent implements OnInit {
  answerUploadForm;
  @Input() question: Upload;

  constructor(
    private assessmentService: AssessmentService,
    public attachmentService: AttachmentService,
    private formBuilder: FormBuilder
  ) {
    this.answerUploadForm = this.formBuilder.group({
      });
   }

  ngOnInit(): void {
  }

  onSubmit() {
    this.question.submittedAnswer = this.attachmentService.getStudentAnswers();
    this.assessmentService.submitAnswer(this.question);
  }
}
