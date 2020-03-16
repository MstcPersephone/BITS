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
      categories: ''
    });
  }

  ngOnInit() {
    this.getCategoriesSelection();
    this.getOrganizedQuestions();
  }

  entered(event: CdkDragEnter<string[]>, data: any) {

    this.question = data;
    console.log(this.question);
   }

   exited(event: CdkDragExit<string[]>) {

    this.question = event.item.data;
    console.log(this.question);
   }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    console.log('Question moved FROM: ');
    console.log(event.previousContainer.element);
    console.log(event.previousContainer.data);
    console.log('Question moved TO: ');
    console.log(event.container.element);
    console.log(event.container.data);

  }

  // public entered(event: CdkDragEnter<Question[]>) {

  //   this.question = event.item.data;
  //   console.log('Entered', this.question);
  //  }

  //  public exited(event: CdkDragExit<string[]>) {

  //   this.question = event.item.data;
  //   console.log('Exited', this.question);
  //  }

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

  // setAssessmentQuestions(this.Entered, this.exited) {

  // }

  onSubmit(assessmentData) {
    // do nothing
  }
}

