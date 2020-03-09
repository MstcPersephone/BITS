import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { QuestionType } from 'src/app/enums/questionType.enum';

@Component({
  selector: 'app-list-true-false',
  templateUrl: './list-true-false.component.html',
  styleUrls: ['./list-true-false.component.css']
})
export class ListTrueFalseComponent implements OnInit {
  public questions: Question[] = [];
  private questionSubscription: Subscription;

  constructor(
    public questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.questionService.getQuestionsByType(QuestionType.TrueFalse);
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
      console.table(this.questions);
    });
  }

}
