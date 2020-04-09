import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation.service';
import { Category } from 'src/app/models/shared/category.model';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  // The form object
  createCategoryForm;

  constructor(
    private formBuilder: FormBuilder,
    public questionService: QuestionService) {
    // Creates an object to hold form values.
    this.createCategoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
  }

  ngOnInit() {
  }

  onSubmit(categoryData) {
    // Initializes a new category to be saved
    const category: Category = new Category();

    // As long as form input is valid data will be passed to question service for saving
    if (this.createCategoryForm.valid) {
      category._id = null;
      category.name = categoryData.categoryName;

      // Adds category to the categories array in the service.
      this.questionService.saveCategory(category, this.createCategoryForm);

      // For testing, we can remove later.
      console.log(category);
    } else {
      // Calls validation on the current form when submit button is clicked
      (Object as any).values(this.createCategoryForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

  }
}
