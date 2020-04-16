import { Component, OnInit, Input } from '@angular/core';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  private assessment: Assessment;
  private assessmentSubscription: Subscription;

  constructor(
    public assessmentEngineService: AssessmentEngineService,
    public assessmentService: AssessmentService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.assessmentSubscription = this.assessmentEngineService.getAssessmentUpdateListener()
    .subscribe((assessment: Assessment) => {
      console.log('assessment to take', assessment);
      this.assessment = assessment;
    });
    this.assessmentEngineService.getTakenAssessmentById(this.route.snapshot.params.takenAssessmentId);
  }

  // The method to start an assessment
  startAssessment() {
    // document.getElementById('validateStudentForm').click();
    this.assessmentEngineService.assessmentStarted = true;
    console.log('Assessment started');
    this.assessmentEngineService.prepareAssessment(this.assessment);
  }

  acceptAnswer() {
    this.assessmentEngineService.acceptAnswer();
  }
}
