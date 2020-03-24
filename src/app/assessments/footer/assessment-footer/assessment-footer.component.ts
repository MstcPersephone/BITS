import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-assessment-footer',
  templateUrl: './assessment-footer.component.html',
  styleUrls: ['./assessment-footer.component.css']
})
export class AssessmentFooterComponent implements OnInit {

  constructor(public assessmentService: AssessmentService) { }

  ngOnInit() {
  }

  onClick() {

  }

}
