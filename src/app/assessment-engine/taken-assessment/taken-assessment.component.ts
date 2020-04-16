import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormArray } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';
import { TakenAssessment } from '../../models/taken-assessment.model';
import { Assessment } from '../../models/assessment.model';


@Component({
  selector: 'app-taken-assessment',
  templateUrl: './taken-assessment.component.html',
  styleUrls: ['./taken-assessment.component.css']
})
export class TakenAssessmentComponent implements OnInit {
  generateAssessmentForm;
  private assessmentSubscription: Subscription;
  public assessmentList: Assessment[] = [];


  constructor(
    private assessmentService: AssessmentService,
    private formBuilder: FormBuilder) {
    this.generateAssessmentForm = this.formBuilder.group({
      assessmentList: ''
    });
  }

  ngOnInit() {
    this.assessmentService.getAllAssessments();
    this.assessmentSubscription = this.assessmentService.getAssessmentsUpdateListener()
      .subscribe((assessmentArray: Assessment[]) => {
        this.assessmentList = assessmentArray;
      });
  }

  onSubmit() {

  }

}
