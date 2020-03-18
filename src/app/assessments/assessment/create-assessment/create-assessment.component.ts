import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from '../../../services/helper.service';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/shared/category.model';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import { FormBuilder, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';

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
  public assessmentQuestions = [];
  private assessmentQuestionsSubscription: Subscription;
  public questionIds = [];
  selectCategoryForm;
  createAssessmentForm;
  config;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    public helperService: HelperService,
    private formBuilder: FormBuilder) {
      this.createAssessmentForm = this.formBuilder.group({
        name: '',
        description: ''
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

    this.assessmentService.getQuestionsByIds(['5e66b1d326d9b22a70aa1c5c']);
    this.assessmentQuestionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
      .subscribe((questionsArray: Question[]) => {
        this.assessmentQuestions = questionsArray;
        console.log(this.assessmentQuestions);
      });
  }

  dropToAssessment(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  dropToQuestionList(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onSubmit(assessmentData) {
    this.assessmentQuestions.forEach((q) => {
      if (!this.questionIds.includes(q._id)) {
        this.questionIds.push(q._id);
      }
    });
    const assessment: Assessment = new Assessment();
    assessment._id = null;
    assessment.name = assessmentData.name;
    assessment.description = assessmentData.description;
    assessment.questionIds = this.questionIds;
    // assessment.config = new AssessmentConfig();
    this.assessmentService.saveAssessment(assessment);
  }
}

