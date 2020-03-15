import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
      categoryName: ''
    });
  }

  ngOnInit() {
  }

  onSubmit(categoryData) {
    const category: Category = new Category();
    category._id = null;
    category.name = categoryData.categoryName;

    // Adds category to the categories array in the service.
    this.questionService.saveCategory(category, this.createCategoryForm);

    // TODO: [PER-118] For testing, we can remove later.
    console.log(category);
  }
}
