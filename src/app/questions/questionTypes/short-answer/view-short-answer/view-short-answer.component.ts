import { Component, OnInit, Input } from '@angular/core';
import { ShortAnswer } from 'src/app/models/question-types/short-answer.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AssessmentEngineService } from 'src/app/services/assessment-engine.service';

@Component({
  selector: 'app-view-short-answer',
  templateUrl: './view-short-answer.component.html',
  styleUrls: ['./view-short-answer.component.css']
})
export class ViewShortAnswerComponent implements OnInit {
answerForm;

@Input() question: ShortAnswer;

  constructor(
    public assessmentService: AssessmentService,
    private assessmentEngineService: AssessmentEngineService,
    private formBuilder: FormBuilder
  ) {
    this.answerForm = this.formBuilder.group({
      studentAnswer: new FormControl('')
    });
   }

  ngOnInit(): void {

  }

  studentAnswer(event: any) {
    this.assessmentEngineService.studentShortAnswer = event.target.value;
    this.question.studentAnswer = event.target.value;
  }
}
