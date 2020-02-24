import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { QuestionType } from 'src/app/enums/questionType.enum';

@Component({
  selector: 'app-list-multiple-choice',
  templateUrl: './list-multiple-choice.component.html',
  styleUrls: ['./list-multiple-choice.component.css']
})
export class ListMultipleChoiceComponent implements OnInit {
  public questions: Question[] = [];
  private questionSubscription: Subscription;

  constructor(
    public questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.questionService.getQuestionsByType(QuestionType.MultipleChoice);
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
      console.log(this.questions);
    });
  }

}
