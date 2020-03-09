import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/shared/category.model';
import { QuestionService } from 'src/app/services/question.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit {
  // The form object
  editCategoryForm;
  createCategoryForm;
  categoryList: Category[] = [];
  private categorySubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public questionService: QuestionService) {
    // Creates an object to hold form values.
    this.editCategoryForm = this.formBuilder.group({
      categoryName: ''
    });
    // Creates an object to hold form values.
    this.createCategoryForm = this.formBuilder.group({
      categoryName: ''
    });
  }

  ngOnInit() {
    this.categorySubscription = this.questionService.getCategoriesListener()
      .subscribe((categoriesArray: Category[]) => {
        this.categoryList = categoriesArray;
        console.table(this.categoryList);
      });

    this.questionService.getAllCategories();
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(categoryData, mep) {
    const category: Category = new Category();
    category._id = null;
    category.name = categoryData.categoryName;

    // Adds option to the options array in the service.
    this.questionService.createCategory(category);

    // Adds option to the options array in the service.
    this.questionService.saveCategory(category, this.createCategoryForm);

    mep.expanded = false;

    // For testing, we can remove later.
    console.log(category);
  }
}
