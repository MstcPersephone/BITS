import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AssessmentEngineService } from '../services/assessment-engine.service';

@Component({
  selector: 'app-assessment-engine',
  templateUrl: './assessment-engine.component.html',
  styleUrls: ['./assessment-engine.component.css']
})
export class AssessmentEngineComponent implements OnInit {
// The answer form to hold the student's submission
  answerForm;
  constructor(
    public assessmentEngineService: AssessmentEngineService,
    private formBuilder: FormBuilder) {
    this.answerForm = this.formBuilder.group({});
   }

  ngOnInit() {
  }

  onSubmit() {
  }
}
