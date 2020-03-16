import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/shared/category.model';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import { FormBuilder, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { exists } from 'fs';
import { Key } from 'protractor';



@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css']
})
export class CreateAssessmentComponent implements OnInit {
  public categories: Category[] = [];
  private categorySubscription: Subscription;
  public organizedQuestions = {};
  private questionSubscription: Subscription;
  public question: any;
  public assessmentQuestions = [] = [];
  public usedQuestion = {};
  public isUsed: boolean;
  public usedQuestionArray = [] = [];
  selectCategoryForm;
  public selectedCategory: Category;
  public selectedName: any;

  constructor(
    public questionService: QuestionService,
    public attachmentService: AttachmentService,
    public helperService: HelperService,
    private assessmentService: AssessmentService,
    private formBuilder: FormBuilder) {
    this.selectCategoryForm = this.formBuilder.group({
      categories: '',
    });

  }

  ngOnInit() {
    this.getCategoriesSelection();
    this.getOrganizedQuestions();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    console.log ('Event:', event);

    console.log('Questions moved FROM: ', event.previousContainer.element, event.previousContainer.data);
    console.log('Questions moved TO: ', event.container.element, event.container.data);
  }

  entered(event: CdkDragEnter<string[]>) {
    console.log('Entered', event.item.data);

    this.usedQuestion = event.item.data.valueOf();
    this.usedQuestionArray.push(this.usedQuestion);

    console.log('Question to use', this.usedQuestion);
    console.log('Used Questions array', this.usedQuestionArray);

  }

  exited(event: CdkDragExit<string[]>) {
    console.log('Exited', event.item.data);
    const key = event.item.data.keys;
    const index = this.usedQuestionArray.indexOf(key);
    this.usedQuestionArray.splice(index, 1);
    console.log('Question to use', this.usedQuestion);
    console.log('Used Questions array', this.usedQuestionArray);
  }

  getCategoriesSelection() {
    // gets the call to api end point to collect all categories from database
    this.questionService.getAllCategories();
    this.questionSubscription = this.questionService.getCategoriesListener()
      .subscribe((categoriesArray: Category[]) => {
        this.categories = categoriesArray;
      });
  }

  getOrganizedQuestions() {
    // gets the call to api end point to collect all questions from database
    this.questionService.getAllQuestions();
    // subsribe to observer to get question array changes
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
      .subscribe((questionsArray: any) => {
        this.organizedQuestions = questionsArray;
      });
  }

  setAssessmentAvailableQuestions(event: any, selectObject: any, selectCategoryForm: any) {
    this.selectedCategory = event.value;
    this.selectedName = this.selectedCategory.name;
  }

  onSubmit(assessmentData) {
    // do nothing
  }
}

