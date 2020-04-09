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
  answerForm;
  @Input() question: Upload;

  constructor(
    private assessmentService: AssessmentService,
    public attachmentService: AttachmentService,
    private formBuilder: FormBuilder
  ) {
    this.answerForm = this.formBuilder.group({
      });
   }

  ngOnInit(): void {
    console.log('QUESTION', this.question);
  }

  onSubmit() {
    this.question.submittedAnswer = this.attachmentService.getStudentAnswers();
    this.attachmentService.clearStudentAnswers();
    this.assessmentService.submitAnswer(this.question);
  }
}
