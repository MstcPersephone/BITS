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
  selectedCategories: Category[] = [];
  selectCategoriesForm;

  private categorySubscription: Subscription;
  private selectedCategoriesSubscription: Subscription;

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
      console.table('All Categories', this.categoryList);
    });

    this.selectedCategoriesSubscription = this.questionService.getSelectedCategoriesListener()
      .subscribe((selectedCategoriesArray: Category[]) => {
        this.selectedCategories = selectedCategoriesArray;
        console.table('Selected Categories', this.selectedCategories);
        this.selectCategoriesForm.get('categoryList').setValue(this.selectedCategories);
      });
  }

  // This is a button click simulation to help with validation when saving question
  onSubmit(categoryData) {
    if (!this.selectCategoriesForm.valid) {
      (Object as any).values(this.selectCategoriesForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  // Compares categories from overall array to selected ones to set default values
  matchSelectedCategories(catOne: Category, catTwo: Category) {
    return catOne._id === catTwo._id;
  }
}
