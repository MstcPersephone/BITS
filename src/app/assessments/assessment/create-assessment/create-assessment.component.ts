import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { QuestionService } from 'src/app/services/question.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { ValidationService } from '../../../services/validation.service';
import { HelperService } from '../../../services/helper.service';
import { Category } from 'src/app/models/shared/category.model';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';

@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css']
})
export class CreateAssessmentComponent implements OnInit {
  isEditMode: boolean;
  public categories: Category[] = [];
  private categorySubscription: Subscription;
  private originalOrganizedQuestions = {};
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
        name: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
        description: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
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

        // Create two copies of the questions
        // organizedQuestions is the array that displays
        // originalOrganizedQuestions is used to refresh the filtered lists
        this.originalOrganizedQuestions = JSON.parse(JSON.stringify(questionsArray));
        this.organizedQuestions = JSON.parse(JSON.stringify(questionsArray));
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
      const question = event.item.data;
      let canMove = true;

      // Check to see if question is already in assessmentQuestions
      this.assessmentQuestions.forEach((q) => {
        if (question._id === q._id) {
          canMove = false;
        }
      });
      if (canMove) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      } else {
        this.helperService.openSnackBar('Question is already added to assessment', 'OK', 'error-dialog', 5000);
      }
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
      this.refreshFilteredQuestions();
    }
  }

  refreshFilteredQuestions() {
    this.organizedQuestions = JSON.parse(JSON.stringify(this.originalOrganizedQuestions));
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
    assessment.config = new AssessmentConfig();
    this.assessmentService.saveAssessment(assessment);
  }
}

