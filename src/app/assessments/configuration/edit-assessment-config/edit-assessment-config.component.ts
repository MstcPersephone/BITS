import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { QuestionService } from 'src/app/services/question.service';


@Component({
  selector: 'app-edit-assessment-config',
  templateUrl: './edit-assessment-config.component.html',
  styleUrls: ['./edit-assessment-config.component.css']
})
export class EditAssessmentConfigComponent implements OnInit, OnDestroy {
  @Input() assessment: Assessment;
  @Input() attachmentsLoaded;
  updateConfigurationForm;
  public value: any;
  isTimedSubscription: Subscription;
  isTimed;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    private formBuilder: FormBuilder) {
    this.updateConfigurationForm = this.formBuilder.group({
      isRandom: '',
      isTimed: '',
      maxTime: '',
      minimumScore: '',
      wrongStreak: ''
    });
  }

  ngOnInit(): void {
    this.updateConfigurationForm.get('isRandom').setValue(this.assessment.config.isRandom);
    this.updateConfigurationForm.get('isTimed').setValue(this.assessment.config.isTimed);
    this.updateConfigurationForm.get('maxTime').setValue(this.assessment.config.maxTime);
    this.updateConfigurationForm.get('minimumScore').setValue(this.assessment.config.minimumScore);
    this.updateConfigurationForm.get('wrongStreak').setValue(this.assessment.config.wrongStreak);
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
    if (!this.updateConfigurationForm.valid) {
      // Runs all validation on the updateConfigurationForm form controls
      (Object as any).values(this.updateConfigurationForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    this.assessmentService.createAssessmentConfiguration(config);
  }

  // Reset service property values so they can be used by a new component
  // Unsubscribes component from the current observable event listeners.
  ngOnDestroy() {
    this.assessmentService.resetService();
  }

}
