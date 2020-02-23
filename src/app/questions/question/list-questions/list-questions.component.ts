import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.css']
})
export class ListQuestionsComponent implements OnInit {
  public questions: Question[] = [];
  private questionSubscription: Subscription;

  constructor(
    private questionService: QuestionService,
    public helperService: HelperService
    ) { }

  ngOnInit() {
    this.questionService.getAllQuestions();
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
      console.log(this.questions);
    });
  }

}
