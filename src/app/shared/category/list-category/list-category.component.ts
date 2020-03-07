import { Component, OnInit, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Category } from 'src/app/models/shared/category.model';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSelect, MatOption } from '@angular/material';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit, AfterViewInit {
  @ViewChildren('categoryOption') categoryOptions;
  categoryList: Category[] = [];
  selectCategoriesForm;

  private categorySubscription: Subscription;

  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder ) {
    this.selectCategoriesForm = this.formBuilder.group({
      categoryList: new FormControl(this.questionService.selectedCategories)
    });
  }

  ngOnInit() {
    this.questionService.getAllCategories();
    this.categorySubscription = this.questionService.getCategoriesListener()
    .subscribe((categoriesArray: Category[]) => {
      this.categoryList = categoriesArray;
      console.table(this.categoryList);
      // this.categorySelect.options.forEach( (item: MatOption) => {
      //   item.select();
      // });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const categoryNames = this.questionService.selectedCategories.map(x => {
        return x.name;
      });
      console.log(this.questionService.selectedCategories);
      this.categoryOptions.forEach((item) => {
        // console.log(item.value);
        if (categoryNames.includes(item.value.name)) {
          (item as MatOption).select();
          console.log(item);
        }
      });
    }, 1000);
  }

  onSubmit(formData) {
    // do nothing
  }

}
