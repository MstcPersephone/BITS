import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-view-assessment-config',
  templateUrl: './view-assessment-config.component.html',
  styleUrls: ['./view-assessment-config.component.css']
})
export class ViewAssessmentConfigComponent implements OnInit {
  config: AssessmentConfig;
  assessment: Assessment;
  private configSubscription: Subscription;
  private assessmentSubscription: Subscription;

  constructor(
    public assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.configSubscription = this.assessmentService.getAssessmentConfigUpdateListener()
    .subscribe((config: AssessmentConfig) => {
      this.config = config;
    });
    this.assessmentService.getAssessmentById(this.route.snapshot.params.assessmentId);
    console.log('Assessment Config', this.config);
  }

}
