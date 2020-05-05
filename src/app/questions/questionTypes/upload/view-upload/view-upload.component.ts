import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Upload } from 'src/app/models/question-types/upload.model';
import { FormBuilder } from '@angular/forms';
import { AttachmentService } from 'src/app/services/attachment.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AssessmentEngineService } from 'src/app/services/assessment-engine.service';

@Component({
  selector: 'app-view-upload',
  templateUrl: './view-upload.component.html',
  styleUrls: ['./view-upload.component.css']
})
export class ViewUploadComponent implements OnInit, OnDestroy {
  answerForm;
  @Input() question: Upload;

  constructor(
    public assessmentService: AssessmentService,
    private assessmentEngineService: AssessmentEngineService,
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
    this.assessmentEngineService.checkAnswer(this.question);
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
  }
}
