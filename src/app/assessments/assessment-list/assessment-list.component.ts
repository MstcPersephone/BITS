import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Subscription } from 'rxjs';
import { Question } from 'src/app/models/question.interface';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css']
})
export class AssessmentListComponent implements OnInit {

  private questionsSubscription: Subscription;
  questions: Question[] = [];

  constructor(public questionsService: QuestionService) { }

  ngOnInit() {
    this.questionsService.getAllQuestions();
    this.questionsSubscription = this.questionsService.getQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
    });

    console.log(this.questions);
  }

}
