import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormArray } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AssessmentEngineService } from 'src/app/services/assessment-engine.service';
import { TakenAssessment } from '../../models/taken-assessment.model';
import { Assessment } from '../../models/assessment.model';
import { Student } from '../../models/student.model';
import { Question } from '../../models/question.interface';



@Component({
  selector: 'app-taken-assessment',
  templateUrl: './taken-assessment.component.html',
  styleUrls: ['./taken-assessment.component.css']
})
export class TakenAssessmentComponent implements OnInit {
  generateAssessmentUrlForm;
  private assessmentSubscription: Subscription;
  public assessmentList: Assessment[] = [];


  constructor(
    private assessmentService: AssessmentService,
    private assessmentEngineService: AssessmentEngineService,
    private formBuilder: FormBuilder) {
    this.generateAssessmentUrlForm = this.formBuilder.group({
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

  onSubmit(takenAssessmentData) {
    const takenAssessment: TakenAssessment = new TakenAssessment();
    takenAssessment._id = null;
    takenAssessment.assessment = takenAssessmentData.assessment;
    takenAssessment.questions = null;
    takenAssessment.score = null;
    takenAssessment.student = null;
    takenAssessment.studentPassed = null;
    this.assessmentEngineService.saveTakenAssessment(takenAssessment);
  }

}
