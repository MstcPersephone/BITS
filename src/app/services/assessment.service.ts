import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Assessment } from '../models/assessment.model';
import { Category } from 'src/app/models/shared/category.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  // MOCK DATA
  public mockQuestionIds: string[] = ['5e50ba9499062123580d5245', '5e512dc2f614c627f0443d18',
    '5e53dfa22849a450c49e1fd7', '5e603f2f2a61154b480ffafd', '5e6166f40a31644b543fc210', '5e6167ef0a31644b543fc218',
    '5e62b546cdf5ff1b5c73d457'];

  // ********************** //
  // ****  PROPERTIES  **** //
  // ********************** //

  // single assessment
  private assessment: Assessment;
  private assessmentUpdated = new Subject<any>();
  private status: any;

  // list of assessments
  private assessments: any;
  private assessmentsUpdated = new Subject<any>();

  // categories
  public selectedCategory: Category;
  public selectedName: any;
  public selectedCategoryName: string;

  // assessment configuration
  isRandom = false;
  isTimed = false;
  private enteredMaxTime = 0;
  private maxTimeUpdated = new Subject<number>();

  private enteredWrongStreak = 0;
  private wrongStreakUpdated = new Subject<number>();

  private changedMinScore = 75;
  private changedMinScoreUpdated = new Subject<number>();

  private assessmentConfig: AssessmentConfig;
  private assessmentConfigUpdated = new Subject<number>();

  // questions
  private questionIds: string[];
  public questions: Question[] = [];
  private currentQuestion: Question;
  private assessmentQuestionsUpdated = new Subject<Question[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private helperService: HelperService, ) { }

  // ******************************************************** //
  // ***************  ASSESSMENT FUNCTIONS  ***************** //
  // ******************************************************** //

  getAssessmentUpdateListener() {
    return this.assessmentUpdated.asObservable();
  }

  getAssessmentsUpdateListener() {
    return this.assessmentsUpdated.asObservable();
  }

  // ******************************************************** //
  // ************  ASSESSMENT ENGINE FUNCTIONS  ************* //
  // ******************************************************** //

  submitAssessment(assessment: Assessment) {
  }

  // TODO Handle submit question button
  submitAnswer(question: Question) {
    console.log(question);
  }

  // *************************************************** //
  // *********  ASSESSMENT: STATUS FUNCTIONS  ********** //
  // *************************************************** //

  changeCompleteStatus() {
    this.status = 'Complete';
  }

  changeInProgressStatus() {
    this.status = 'In Progress';
  }

  // ******************************************************** //
  // ****************  CATEGORY FUNCTIONS  ****************** //
  // ******************************************************** //

  // Sets the the available questions by category on create-assessment
  setCategoryCollections(event: any, selectObject: any, selectCategoryForm: any) {
    this.selectedCategory = event.value;
    this.selectedCategoryName = this.selectedCategory.name;
  }


  // ******************************************************** //
  // **************  CONFIGURATION FUNCTIONS  *************** //
  // ******************************************************** //

  createAssessmentConfiguration(configData: any) {
    const updatedConfigurationItems = configData;

    updatedConfigurationItems.duration = configData.duration;
    updatedConfigurationItems.isRandom = configData.isRandom;
    updatedConfigurationItems.isTimed = configData.isTimed;
    updatedConfigurationItems.maxTime = configData.maxTime;
    updatedConfigurationItems.minimumScore = configData.minimumScore;
    updatedConfigurationItems.wrongStreak = configData.wrongStreak;
    console.log('Configuration', updatedConfigurationItems);
    this.assessmentConfig = updatedConfigurationItems;
  }

  // ******************************************************** //
  // *********  CONFIGURATION: ISRANDOM FUNCTIONS  ********** //
  // ******************************************************** //

  // sets the isRandom based upon a click event
  isRandomChanged() {
    this.isRandom = !this.isRandom;
    return this.isRandom;
  }

  // ******************************************************** //
  // **********  CONFIGURATION: ISTIMED FUNCTIONS  ********** //
  // ******************************************************** //

  // sets the isTimed based upon a click event
  isTimedChanged() {
    this.isTimed = !this.isTimed;
    return this.isTimed;
  }

  // ******************************************************** //
  // *********  CONFIGURATION: MIN SCORE FUNCTIONS  ********* //
  // ******************************************************** //

  // gets the minimum score set by user in configuration
  getMinScore() {
    return this.changedMinScore;
  }

  // gets the changed score based upon slider event
  minScoreChanged($event, value) {
    this.changedMinScore = value;
    return this.changedMinScore;
  }

  // ******************************************************** //
  // *********  CONFIGURATION: MAX TIME FUNCTIONS  ********** //
  // ******************************************************** //

  getMaxTime() {
    return this.enteredMaxTime;
  }

  getmaxTimUpdatedListener() {
    return this.maxTimeUpdated.asObservable();
  }

  onHandleMaxTime(event: any) {
    this.enteredMaxTime = event.target.value;
    console.log(this.enteredMaxTime);
  }

  // ******************************************************** //
  // *******  CONFIGURATION: WRONG STREAK FUNCTIONS  ******** //
  // ******************************************************** //

  getWrongStreakListener() {
    return this.wrongStreakUpdated.asObservable();
  }

  getWrongStreak() {
    return this.enteredWrongStreak;
  }

  onHandleWrongStreak(event: any) {
    this.enteredWrongStreak = event.target.value;
    console.log(this.enteredWrongStreak);
  }

  // ******************************************************** //
  // ****************  QUESTION FUNCTIONS  ****************** //
  // ******************************************************** //

  getAssessmentQuestionsUpdatedListener() {
    return this.assessmentQuestionsUpdated.asObservable();
  }

  // gets a list of questions from an array of ids
  getQuestionsByIds(questionIds: string[]) {
    this.http
      .post<{ message: string, questions: Question[] }>('http://localhost:3000/api/assessment/questions/', { questionIds })
      .subscribe(
        responseData => {
          this.questions = responseData.questions;
          this.assessmentQuestionsUpdated.next(this.questions);
          console.log(responseData.message);
          console.log(responseData.questions);
        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  // ******************************************************** //
  // ***************  API CALLS TO BACKEND  ***************** //
  // ******************************************************** //
  // Gets all assessments from the database.
  getAllAssessments() {
    this.http
      .get<{ message: string, assessments: Assessment[] }>(
        'http://localhost:3000/api/assessments'
      )
      .subscribe((assessmentData) => {
        this.assessments = assessmentData.assessments.reverse();
        console.log(this.assessments);
        // Subscribers get a copy of the assessments array
        this.assessmentsUpdated.next(this.assessments);
      },
        error => {
          // log error message from server
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  saveAssessment(assessment: Assessment) {
    const completeAssessment: any = assessment;
    completeAssessment.config = this.assessmentConfig;
    completeAssessment.status = this.status;
    console.log('Complete Assessment', completeAssessment);

    this.http.post<{ message: string, assesment: Assessment }>('http://localhost:3000/api/assessment/save', completeAssessment)
      .subscribe(
        responseData => {
          this.helperService.openSnackBar(completeAssessment.name + ' Assessment Saved Successfully!', 'Close', 'success-dialog', 5000);
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.assesment);
          this.router.navigate(['/assessment/list']);

        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

}
