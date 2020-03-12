import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/shared/category.model';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.css']
})
export class ListQuestionsComponent implements OnInit {
  public organizedQuestions = [];
  public categories: Category[] = [];
  private categorySubscription: Subscription;
  public questions: Question[] = [];
  private questionSubscription: Subscription;

  constructor(
    public questionService: QuestionService,
    public attachmentService: AttachmentService
  ) { }

  ngOnInit() {
    // gets the call to api end point to collect all categories from database
    this.questionService.getAllCategories();
    // subsribe to observer to get category array changes
    this.categorySubscription = this.questionService.getCategoriesListener()
      .subscribe((categoriesArray: Category[]) => {
        this.categories = categoriesArray;
        console.table(this.categories);
      });

    // gets the call to api end point to collect all questions from database
    this.questionService.getAllQuestions();
    // subsribe to observer to get question array changes
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
      .subscribe((questionsArray: Question[]) => {
        this.questions = questionsArray;
        // call to function to short questions by category
        this.sortByCategory();
        console.table(this.questions);
      });
  }

  // this function will get all categories, then sort the questions by category
  sortByCategory() {
    // Loop through categories to create separate arrays
    this.categories.forEach((c) => {
      // push new object
      // property is category name
      // value is array to hold questions
      this.organizedQuestions[c.name] = [];
    });

    // for each question
    this.questions.forEach((q) => {
      if (q.categories !== undefined && q.categories.length > 0) {
        // for each category attached to the question
        q.categories.forEach((c) => {
          // Find the proper category array and push the question
          this.organizedQuestions[c.name].push(q);
        });
       }
    });
    console.log(this.organizedQuestions);
  }
}
