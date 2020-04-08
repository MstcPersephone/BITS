import { Component, OnInit, Input } from '@angular/core';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public assessmentEngineService: AssessmentEngineService) { }

  ngOnInit() {
  }

  // The method to start an assessment
  startAssessment() {
    document.getElementById('validateStudentForm').click();
    this.assessmentEngineService.assessmentStarted = true;
    console.log('Assessment started');
}
}
