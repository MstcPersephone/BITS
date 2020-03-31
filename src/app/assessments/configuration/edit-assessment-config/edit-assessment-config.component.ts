import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { QuestionService } from 'src/app/services/question.service';
import { Subscription } from 'rxjs';
import { Assessment } from 'src/app/models/assessment.model';

@Component({
  selector: 'app-edit-assessment-config',
  templateUrl: './edit-assessment-config.component.html',
  styleUrls: ['./edit-assessment-config.component.css']
})
export class EditAssessmentConfigComponent implements OnInit {
  @Input() assessment: Assessment;
  updateConfigurationForm;
  public value: any;
  maxTimeSubscription: Subscription;
  maxTime: number;
  wrongStreakSubscription: Subscription;
  wrongStreak: number;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    private formBuilder: FormBuilder) {
    this.updateConfigurationForm = this.formBuilder.group({
      isRandom: false,
      isTimed: false,
      maxTime: '',
      minimumScore: this.assessmentService.getMinScore(),
      wrongStreak: ''
    });
  }

  ngOnInit(): void  {
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
