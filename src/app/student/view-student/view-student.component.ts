import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AssessmentEngineService } from 'src/app/services/assessment-engine.service';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';
import { TakenAssessment } from 'src/app/models/taken-assessment.model';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit, OnDestroy {
  takenAssessment: any;
  private takenAssessmentSubscription: Subscription;
  dateTaken: any;
  searchParameters: '';

  constructor(
    public assessmentEngineService: AssessmentEngineService,
    public questionService: QuestionService,
    public attachmentService: AttachmentService,
    public helperService: HelperService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.takenAssessmentSubscription = this.assessmentEngineService.getTakenAssessmentUpdateListener()
      .subscribe((takenAssessment: any) => {
        console.log('Taken Assessment', takenAssessment);
        this.takenAssessment = takenAssessment;
      });
    this.assessmentEngineService.getTakenAssessmentById(params.takenAssessmentId);

    // If search parameters where passed, store them.
    if (params.searchParameters !== '') {
      this.searchParameters = params.searchParameters;
    }
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
  }
}
