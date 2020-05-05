import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/shared/category.model';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import { QuestionService } from 'src/app/services/question.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from '../../../services/helper.service';
import { ValidationService } from '../../../services/validation.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';

@Component({
  selector: 'app-edit-assessment',
  templateUrl: './edit-assessment.component.html',
  styleUrls: ['./edit-assessment.component.css']
})
export class EditAssessmentComponent implements OnInit, OnDestroy {
  isEditMode: boolean;
  public categories: Category[] = [];
  private categorySubscription: Subscription;
  private originalOrganizedQuestions = {};
  public organizedQuestions = {};
  private questionSubscription: Subscription;
  public assessmentQuestions = [];
  private assessmentQuestionsSubscription: Subscription;
  public questionIds = [];

  assessment: Assessment;
  assessmentSubscription: Subscription;
  updateAssessmentForm;
  selectCategoryForm;
  config;

  constructor(
    private route: ActivatedRoute,
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    public helperService: HelperService,
    private formBuilder: FormBuilder) {
    this.updateAssessmentForm = this.formBuilder.group({
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

    // Sets up an assessment listener to get a new assessment
    // Gets the assessment based on the passed in id
    // id is passed through the URL
    this.assessmentService.getAssessmentById(this.route.snapshot.params.assessmentId);
    this.assessmentSubscription = this.assessmentService.getAssessmentUpdateListener()
      .subscribe((assessment: Assessment) => {
        this.assessment = assessment;
        this.updateAssessmentForm.get('name').setValue(this.assessment.name);
        this.updateAssessmentForm.get('description').setValue(this.assessment.description);
        this.assessmentService.getQuestionsByIds(assessment.questionIds);
      });
    this.assessmentQuestionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
      .subscribe((questionsArray) => {
        this.assessmentQuestions = questionsArray;
      });
  }

  dropToAssessment(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log('ORDER CHANGED', this.assessmentQuestions);
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

    console.log('SUBMITTED Assessment Questions: ', this.assessmentQuestions);

    // Reset questionIds after validation (once validation in place)
    this.questionIds = [];
    this.assessmentQuestions.forEach((q) => {
      this.questionIds.push(q._id);
    });

    console.log('QUESTION IDs', this.questionIds);

    const updatedAssessment: Assessment = new Assessment();

    // Calls validation on the current form when submit button is clicked
    if (!this.updateAssessmentForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.updateAssessmentForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.updateAssessmentForm.valid) {
      updatedAssessment._id = this.assessment._id;
      updatedAssessment.name = assessmentData.name;
      updatedAssessment.description = assessmentData.description;
      updatedAssessment.questionIds = this.questionIds;
      updatedAssessment.config = new AssessmentConfig();

      const status = this.assessmentService.getStatus();
      // console.log('status', this.assessmentService.getStatus());

      // If a question is selected, allow the Save Button to be clicked
      // Else, throw a snackbar and stay on the page
      if (status === 'Complete') {
        const response = ValidationService.validateMinimumQuestions(updatedAssessment);
        if (response.result) {
          this.assessmentService.updateAssessmentById(updatedAssessment);
        } else {
          this.helperService.openSnackBar(response.message, 'OK', 'error-dialog', undefined);
        }
      } else {
        this.assessmentService.updateAssessmentById(updatedAssessment);
      }
    }
  }

  // Reset service property values so they can be used by a new component
  // Unsubscribes component from the current observable event listeners.
  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
    this.questionSubscription.unsubscribe();
    this.assessmentQuestionsSubscription.unsubscribe();
    this.assessmentService.resetService();
    this.questionService.resetService();
  }
}
