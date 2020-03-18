import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { QuestionService } from 'src/app/services/question.service';
import {MatSliderModule} from '@angular/material/slider';


@Component({
  selector: 'app-create-assessment-config',
  templateUrl: './create-assessment-config.component.html',
  styleUrls: ['./create-assessment-config.component.css']
})
export class CreateAssessmentConfigComponent implements OnInit {
  createConfigurationForm;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    private formBuilder: FormBuilder) {
    this.createConfigurationForm = this.formBuilder.group({
      isRandom: '',
      isTimed: '',
      maxTime: '',
    });
  }

  ngOnInit() {

  }

  formatMaxTimeLabel(value: number) {

      return Math.round(value * 60) + 'min';
  }

  onSubmit(configurationdata) {
    const config: AssessmentConfig = new AssessmentConfig();
    config.isRandom = this.assessmentService.isRandomChanged();
    config.isTimed = this.assessmentService.isTimedChanged();
    config.maxTime = configurationdata.maxTime;
    config.minimumScore = null;
    config.wrongStreak = null;
    config.duration = null;
  }

}
