import { Component, OnInit, Input } from '@angular/core';
import { AssessmentService } from 'src/app/services/assessment.service';
import { Assessment } from 'src/app/models/assessment.model';

@Component({
  selector: 'app-assessment-footer',
  templateUrl: './assessment-footer.component.html',
  styleUrls: ['./assessment-footer.component.css']
})
export class AssessmentFooterComponent implements OnInit {
  @Input() isEditMode: boolean;
  @Input() assessment: Assessment;

  constructor(public assessmentService: AssessmentService) { }

  ngOnInit() {
  }

  onClick() {

  }

}
