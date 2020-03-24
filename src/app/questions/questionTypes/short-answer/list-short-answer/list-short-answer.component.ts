import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { QuestionType } from 'src/app/enums/questionType.enum';

@Component({
  selector: 'app-list-short-answer',
  templateUrl: './list-short-answer.component.html',
  styleUrls: ['./list-short-answer.component.css']
})
export class ListShortAnswerComponent implements OnInit {
  public questions: Question[] = [];
  private questionSubscription: Subscription;

  constructor(
    public questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.questionService.getQuestionsByType(QuestionType.ShortAnswer);
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
      console.table(this.questions);
    });
  }

}
