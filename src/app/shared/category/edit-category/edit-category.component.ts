import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { Category } from 'src/app/models/shared/category.model';
import { HelperService } from 'src/app/services/helper.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation.service';


@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  categorySubscription: Subscription;
  category: Category;

  editCategoryForm;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    public helperService: HelperService,
    private formBuilder: FormBuilder
  ) {
    this.editCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
  }

  ngOnInit() {
    this.categorySubscription = this.questionService.getCategoryListener()
      .subscribe((category: Category) => {
        this.category = category;
        if (this.category !== undefined) {
          this.editCategoryForm.get('name').setValue(this.category.name);
        }
      });

    this.questionService.getCategoryById(this.route.snapshot.params.categoryId);
  }

  onSubmit(formData) {
    // if form is valid, update category...
    if (this.editCategoryForm.valid) {
      this.category.name = formData.name;
      this.questionService.updateCategoryById(this.category);
    } else {
      // else mark invalid fields
      (Object as any).values(this.editCategoryForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
    this.questionService.resetService();
  }
}
