import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/shared/category.model';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from '../../../services/validation.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

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
      categoryList: ['', [Validators.required]]
    });
  }

  // This component is inherited into the Create Question and builds the category selector form
  ngOnInit() {
    this.questionService.getAllCategories();
    this.categorySubscription = this.questionService.getCategoriesListener()
    .subscribe((categoriesArray: Category[]) => {
      this.categoryList = categoriesArray;
      console.table(this.categoryList);
    });
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(categoryData) {
    // do nothing
  }
}
