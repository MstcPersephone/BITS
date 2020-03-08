import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/shared/category.model';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.css']
})
export class ListQuestionsComponent implements OnInit {
  public questions: Question[] = [];
  private questionSubscription: Subscription;
  public categories: Category[] = [];
  private categorySubscription: Subscription;

  constructor(
    public questionService: QuestionService
    ) { }

  ngOnInit() {
    this.questionService.getAllCategories();
    this.categorySubscription = this.questionService.getCategoriesListener()
    .subscribe((categoriesArray: Category[]) => {
      this.categories = categoriesArray;
      console.table(this.categories);
    });
    this.questionService.getAllQuestions();
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
      console.table(this.questions);
    });
  }



}
