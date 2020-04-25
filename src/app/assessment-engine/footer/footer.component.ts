import { Component, OnInit, Input } from '@angular/core';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TakenAssessment } from 'src/app/models/taken-assessment.model';
import { Student } from 'src/app/models/student.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  private takenAssessment: TakenAssessment;
  private takenAssessmentSubscription: Subscription;
  private currentStudent: Student;
  private currentStudentSubscription: Subscription;

  constructor(
    public assessmentEngineService: AssessmentEngineService,
    public assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.takenAssessmentSubscription = this.assessmentEngineService.getTakenAssessmentUpdateListener()
      .subscribe((takenAssessment: TakenAssessment) => {
        console.log('assessment to take', takenAssessment);
        this.takenAssessment = takenAssessment;
      });
    this.assessmentEngineService.getTakenAssessmentById(this.route.snapshot.params.takenAssessmentId);
  }

 // The method to start an assessment
 startAssessment() {
  // simulates a button click to run student form validation.
  document.getElementById('validateStudentForm').click();

  // gets a stored value for whether the student form is valid
  const studentFormIsValid = this.assessmentEngineService.getStudentFormIsValid();

  // If the student form has passed validation, start the assessment
  if (studentFormIsValid) {
    // Get the student that was entered on the webform
    this.currentStudentSubscription = this.assessmentEngineService.getAssessmentStudentUpdateListener()
    .subscribe((student: Student) => {
      this.takenAssessment.student = student;
      // This starts process for saving student info on the taken assessment collection of DB
      this.assessmentEngineService.updateTakenAssessment(this.takenAssessment);
      // Sets the assessment to start
      this.assessmentEngineService.assessmentStarted = true;
      console.log('Assessment started');
      // Gets the function to prepare the assessment configurations for the assessment
      this.assessmentEngineService.prepareAssessment(this.takenAssessment.assessment);
    });
  }
  // this.assessmentEngineService.prepareAssessment(this.takenAssessment.assessment);
}

  acceptAnswer() {
    this.assessmentEngineService.acceptAnswer();
  }
}
