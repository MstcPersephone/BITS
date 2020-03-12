import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/shared/category.model';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {
  categoryList: Category[] = [];
  selectCategoriesForm;

  private categorySubscription: Subscription;

  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder ) {
    this.selectCategoriesForm = this.formBuilder.group({
      categoryList: ''
    });
  }

  ngOnInit() {
    this.questionService.getAllCategories();
    this.categorySubscription = this.questionService.getCategoriesListener()
    .subscribe((categoriesArray: Category[]) => {
      this.categoryList = categoriesArray;
      console.table(this.categoryList);
    });
  }

  onSubmit(formData) {
    // do nothing
  }

}
