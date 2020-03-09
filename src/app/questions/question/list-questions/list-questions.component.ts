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
  public organizedQuestions = [];
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
        this.sortByCategory();
        console.table(this.questions);
      });
  }

  sortByCategory() {
    // Loop through categories to create separate arrays
    this.categories.forEach((c) => {
      // get category name without spaces
      const catName = c.name.replace(/\s/g, '');
      // push new object
      // property is category name
      // value is array to hold questions
      this.organizedQuestions[catName] = [];
    });


    // for each question
    this.questions.forEach((q) => {
      if (q.categories !== undefined && q.categories.length > 0) {
        // for each category attached to the question
        q.categories.forEach((c) => {
          // get the category name
          const catName = c.name.replace(/\s/g, '');
          // Find the proper array and push the question
          this.organizedQuestions[catName].push(q);
        });
      }
    });
    console.log(this.organizedQuestions);

    return this.organizedQuestions;
  }
}
