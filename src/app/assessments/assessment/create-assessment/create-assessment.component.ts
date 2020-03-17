import { Component, OnInit} from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/shared/category.model';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import { FormBuilder, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';


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
  public assessmentQuestions = [] = [];
  private questionIds = [];
  selectCategoryForm;
  createAssessmentForm;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    private formBuilder: FormBuilder) {
      this.createAssessmentForm = this.formBuilder.group({
        name: '',
        description: '',
        questionIds: ''
      });
      this.selectCategoryForm = this.formBuilder.group({
      categories: '',
    });

  }

  ngOnInit() {
    // gets the call to api end point to collect all categories from database
    this.questionService.getAllCategories();
    this.categorySubscription = this.questionService.getCategoriesListener()
      .subscribe((categoriesArray: Category[]) => {
        this.categories = categoriesArray;
      });
    // gets the call to api end point to collect all questions from database
    this.questionService.getAllQuestions();
    // subsribe to observer to get question array changes
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
      .subscribe((questionsArray: any) => {
        this.organizedQuestions = questionsArray;
      });
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
    // console.log ('Event:', event);
    // console.log('Questions moved FROM: ', event.previousContainer.element, event.previousContainer.data);
    // console.log('Questions moved TO: ', event.container.element, event.container.data);
  }

  entered(event: any) {
    if (this.questionIds.includes(event.item.data.value._id)) {
      alert('This question has already been added to the assessment.');
    } else {
      this.questionIds.push(event.item.data.value._id);
    }

    console.log('ADDING TO Assessment/list of Ids', this.questionIds);
    console.log('ADDING TO Assessment/Id Added', event.item.data.value._id);
  }

  exited(event: any) {
    // The question id from the event
    const questionId = event.item.data.value._id;
    // If the question id is in the list of selected questions...
    if (this.questionIds.includes(questionId)) {
      // Get the index of the questionId
      const index = this.questionIds.indexOf(questionId);
      // Remove the questionId from the list of selected questions
      this.questionIds.splice(index, 1);
    }
    console.log('REMOVING FROM Assessment/list of Ids', this.questionIds);
    console.log('REMOVING FROM Assessment/Id Added', questionId);
  }

  onSubmit(assessmentData) {
    const assessment: Assessment = new Assessment();
    assessment._id = null;
    assessment.name = assessmentData.name;
    assessment.description = assessmentData.description;
    assessment.questionIds = null;
    assessment.config = null;
    assessment.status = null;

    console.log('New Assessment', assessment);

  }
}

