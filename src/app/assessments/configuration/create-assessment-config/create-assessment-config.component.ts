import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CreateAssessmentConfigComponent implements OnInit, OnDestroy {
  createConfigurationForm;
  maxTime: number;
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
    // resets all properties that might have stored values in the assessment service.
    this.assessmentService.resetService();
    // sets the default values
    this.maxTime = 0;
    this.wrongStreak = 0;
  }

  // Adds a percent to the value displayed in template
  formatMinScoreLabel(value: number) {
    return value + '%';
  }

  onSubmit(configurationdata) {
    // Initializes the new AssessmentConfig to be created
    const config: AssessmentConfig = new AssessmentConfig();

    // Adds all the form values to the properties of the new AssessmentConfig
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

    // Send the property values to the assessment service to include on the assessment
    this.assessmentService.createAssessmentConfiguration(config);
  }

    // Reset service property values so they can be used by a new component
    ngOnDestroy() {
      this.assessmentService.resetService();
    }

}
