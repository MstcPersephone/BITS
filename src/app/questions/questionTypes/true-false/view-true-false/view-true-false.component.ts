import { Component, OnInit, Input } from '@angular/core';
import { TrueFalse } from 'src/app/models/question-types/true-false.model';
import { FormBuilder } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AssessmentEngineService } from 'src/app/services/assessment-engine.service';

@Component({
  selector: 'app-view-true-false',
  templateUrl: './view-true-false.component.html',
  styleUrls: ['./view-true-false.component.css']
})
export class ViewTrueFalseComponent implements OnInit {
answerForm;
@Input() question: TrueFalse;

  constructor(
    public assessmentService: AssessmentService,
    private assessmentEngineService: AssessmentEngineService,
    private formBuilder: FormBuilder
  ) {
    this.answerForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
  }

  onChangeOption($event) {
    this.question.studentAnswer = $event.value;
  }

  onSubmit() {
    this.assessmentEngineService.checkAnswer(this.question);
  }

}
