import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { TakenAssessment } from 'src/app/models/taken-assessment.model';
import { HelperService } from 'src/app/services/helper.service';
import { LoginEngineService } from 'src/app/services/login.service';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { Question } from 'src/app/models/question.interface';


@Component({
  selector: 'app-assessment-engine',
  templateUrl: './assessment-engine.component.html',
  styleUrls: ['./assessment-engine.component.css'],
  providers: [AssessmentEngineService]
})
export class AssessmentEngineComponent implements OnInit {
  public takenAssessment: TakenAssessment;
  private takenAssessmentSubscription: Subscription;
// The answer form to hold the student's submission
  answerForm;
  assessmentTaken;

  constructor(
    public assessmentEngineService: AssessmentEngineService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public helperService: HelperService,
    private loginService: LoginEngineService) {
    this.answerForm = this.formBuilder.group({});
   }

  ngOnInit() {
    this.takenAssessmentSubscription = this.assessmentEngineService.getTakenAssessmentUpdateListener()
      .subscribe((takenAssessment: TakenAssessment) => {
        console.log('assessment to take', takenAssessment);
        this.takenAssessment = takenAssessment;
        // Setting property to define whether the assessment has been taken yet or not.
        if (this.takenAssessment.studentPassed === null) {
            this.assessmentTaken = false;
        } else if (this.takenAssessment.studentPassed !== null) {
          this.assessmentTaken = true;
        }
      });
    this.assessmentEngineService.getTakenAssessmentById(this.route.snapshot.params.takenAssessmentId);
    this.helperService.isActiveAssessment = true;
    this.loginService.logout();
  }

  onSubmit(formData) {
  }

}
