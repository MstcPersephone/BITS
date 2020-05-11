import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from 'src/app/models/shared/category.model';
import { QuestionService } from 'src/app/services/question.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit, OnDestroy {
  // The form object
  editCategoryForm;
  createCategoryForm;
  categoryList: Category[] = [];
  private categorySubscription: Subscription;

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public questionService: QuestionService) {
    // Creates an object to hold form values.
    this.editCategoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
    // Creates an object to hold form values.
    this.createCategoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
  }

  // On load this displays the form, as well as list of categories with edit/delete capabilities.
  ngOnInit() {
    this.categorySubscription = this.questionService.getCategoriesListener()
      .subscribe((categoriesArray: Category[]) => {
        this.categoryList = categoriesArray;
        console.table(this.categoryList);
      });

    this.questionService.getAllCategories();
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(categoryData) {
    // Initializes a new category to be saved
    const category: Category = new Category();

    // Calls validation on the current form when submit button is clicked
    if (!this.createCategoryForm.valid) {
      // Runs all validation on the createCategoryForm form controls
      (Object as any).values(this.createCategoryForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // Calls validation on the current form when submit button is clicked
    if (!this.editCategoryForm.valid) {
      // Runs all validation on the editCategoryForm form controls
      (Object as any).values(this.editCategoryForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // As long as input for either form is valid, data will be passed to question service for saving
    if (this.createCategoryForm.valid || this.editCategoryForm.valid) {
      category._id = null;
      category.name = categoryData.categoryName;

      // Adds category to the category array in the service.
      this.questionService.createCategory(category);

      // The call to question service which will send categories to backend to be saved in database..
      this.questionService.saveCategory(category, this.createCategoryForm);

      // For testing, we can remove later.
      console.log(category);
    }
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
    this.questionService.resetService();
  }
}
