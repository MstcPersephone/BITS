import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { QuestionType } from 'src/app/enums/questionType.enum';

@Component({
  selector: 'app-list-checkbox',
  templateUrl: './list-checkbox.component.html',
  styleUrls: ['./list-checkbox.component.css']
})
export class ListCheckboxComponent implements OnInit {
  public questions: Question[] = [];
  private questionSubscription: Subscription;

  constructor(
    public questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.questionService.getQuestionsByType(QuestionType.CheckBox);
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
      console.table(this.questions);
    });
  }

}
