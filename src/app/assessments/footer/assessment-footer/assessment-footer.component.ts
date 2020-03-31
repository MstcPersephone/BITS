import { Component, OnInit, Input } from '@angular/core';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-assessment-footer',
  templateUrl: './assessment-footer.component.html',
  styleUrls: ['./assessment-footer.component.css']
})
export class AssessmentFooterComponent implements OnInit {
  @Input() isEditMode: boolean;

  constructor(public assessmentService: AssessmentService) { }

  ngOnInit() {
  }

  onClick() {

  }

}
