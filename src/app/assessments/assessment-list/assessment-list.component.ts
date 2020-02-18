import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css']
})
export class AssessmentListComponent implements OnInit {

  constructor(public questionsService: QuestionService) { }

  ngOnInit() {
    const questions = this.questionsService.getAllQuestions();
    console.log(questions);
  }

}
