import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from '../../../services/validation.service';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-assessment-config',
  templateUrl: './create-assessment-config.component.html',
  styleUrls: ['./create-assessment-config.component.css']
})
export class CreateAssessmentConfigComponent implements OnInit {
  createConfigurationForm;
  public value: any;
  maxTimeSubscription: Subscription;
  maxTime: number;
  wrongStreakSubscription: Subscription;
  wrongStreak: number;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    private formBuilder: FormBuilder) {
    this.createConfigurationForm = this.formBuilder.group({
      isRandom: false,
      isTimed: false,
      maxTime: [0, [ValidationService.numberValidator]],
      minimumScore: 75,
      wrongStreak: [0, [ValidationService.numberValidator]]
    });
  }

  ngOnInit() {
    this.maxTime = 0;
    this.wrongStreak = 0;
  }

  formatMinScoreLabel(value: number) {
    return value + '%';
  }

  onSubmit(configurationdata) {
    const config: AssessmentConfig = new AssessmentConfig();
    config.duration = null;
    config.isRandom = configurationdata.isRandom;
    config.isTimed = configurationdata.isTimed;
    config.maxTime = this.assessmentService.getMaxTime();
    config.wrongStreak = this.assessmentService.getWrongStreak();
    config.minimumScore = configurationdata.minimumScore;
    this.assessmentService.createAssessmentConfiguration(config);
  }
}
