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
  private takenAssessmentIdSubscription: Subscription;
  public assessmentList: Assessment[] = [];
  takenAssessmentId;
  selectedAssessment: any;


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
    this.takenAssessmentIdSubscription = this.assessmentEngineService.getTakenAssessmentIdUpdateListener()
      .subscribe((takenAssessmentId: string) => {
        this.takenAssessmentId = takenAssessmentId;
      });
  }

  onSubmit(takenAssessmentData) {
    const takenAssessment: TakenAssessment = new TakenAssessment();
    takenAssessment._id = null;
    takenAssessment.assessment = this.selectedAssessment;
    takenAssessment.questions = null;
    takenAssessment.score = null;
    takenAssessment.student = null;
    takenAssessment.studentPassed = null;
    this.assessmentEngineService.saveTakenAssessment(takenAssessment);
  }

}
