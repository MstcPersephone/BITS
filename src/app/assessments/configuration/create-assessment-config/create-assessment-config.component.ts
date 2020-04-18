import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from '../../../services/validation.service';
import { HelperService } from '../../../services/helper.service';

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
    private formBuilder: FormBuilder,
    public helperService: HelperService) {
    this.createConfigurationForm = this.formBuilder.group({
      isRandom: false,
      isTimed: false,
      maxTime: 0,
      minimumScore: 75,
      wrongStreak: 0
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

    // Calls validation on the current form when submit button is clicked
    if (!this.createConfigurationForm.valid) {
      // Runs all validation on the createConfigurationForm form controls
      (Object as any).values(this.createConfigurationForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    this.assessmentService.createAssessmentConfiguration(config);
  }
}
