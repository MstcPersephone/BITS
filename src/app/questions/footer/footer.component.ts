import { Component, OnInit, Input } from '@angular/core';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { Question } from 'src/app/models/question.interface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() question: Question;
  constructor(public assessmentEngineService: AssessmentEngineService) { }

  ngOnInit() {
  }

}
