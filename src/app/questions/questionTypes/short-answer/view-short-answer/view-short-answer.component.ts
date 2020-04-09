import { Component, OnInit, Input } from '@angular/core';
import { ShortAnswer } from 'src/app/models/question-types/short-answer.model';
import { FormBuilder } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-view-short-answer',
  templateUrl: './view-short-answer.component.html',
  styleUrls: ['./view-short-answer.component.css']
})
export class ViewShortAnswerComponent implements OnInit {
answerForm;

@Input() question: ShortAnswer;

  constructor(
    private assessmentService: AssessmentService,
    private formBuilder: FormBuilder
  ) {
    this.answerForm = this.formBuilder.group({
      studentAnswer: ''
    });
   }

  ngOnInit(): void {
  }

  onSubmit(formData) {
    this.question.studentAnswer = formData.studentAnswer;
    this.assessmentService.submitAnswer(this.question);
  }
}
