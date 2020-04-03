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

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  // MOCK DATA
  public mockQuestionIds: string[] = ['5e50ba9499062123580d5245', '5e512dc2f614c627f0443d18',
    '5e53dfa22849a450c49e1fd7', '5e603f2f2a61154b480ffafd', '5e6166f40a31644b543fc210', '5e6167ef0a31644b543fc218',
    '5e62b546cdf5ff1b5c73d457'];

  // ********************************* //
  // ****  ASSESSMENT PROPERTIES  **** //
  // ********************************* //
  // single assessment
  private assessment: Assessment;
  private assessmentUpdated = new Subject<Assessment>();

  // list of assessments
  private assessments: any;
  private assessmentsUpdated = new Subject<any>();

  // status
  private status: any;

  // *********************************************** //
  // ****  ASSESSMENT CONFIGURATION PROPERTIES  **** //
  // *********************************************** //
  private assessmentConfig: AssessmentConfig;
  private assessmentConfigUpdated = new Subject<AssessmentConfig>();


  isRandom = false;
  isTimed = false;
  private isTimedUpdated = new Subject<boolean>();

  maxTime = 0;

  // config wrongStreak default: 0
  wrongStreak = 0;

  // // config minScore default: 75%
  minimumScore = 75;
  private changedMinScoreUpdated = new Subject<number>();

  // ******************************* //
  // ****  CATEGORY PROPERTIES  **** //
  // ******************************* //
  public selectedCategory: Category;
  public selectedName: any;
  public selectedCategoryName: string;

  // ******************************* //
  // ****  QUESTION PROPERTIES  **** //
  // ******************************* //
  public questionIds: string[];
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

  // Sets the status to complete is Save Assessment button is clicked
  changeCompleteStatus() {
    this.status = 'Complete';
  }

  // Sets the status to in progress is Finish Later button is clicked
  changeInProgressStatus() {
    this.status = 'In Progress';
  }

  // Returns the given status of the assessment created in the webform
  // based upon the click event above
  getStatus() {
    return this.status;
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

  // Stores the values of the configuration items tied to an assessment
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

  resetConfigurationForm() {
    // Clear values that are stored in the service.
    this.isRandom = false;
    this.isTimed = false;
    this.maxTime = null;
    this.minimumScore = 75;
    this.wrongStreak = 0;
    }

  getAssessmentConfigUpdateListener() {
    return this.assessmentConfigUpdated.asObservable();
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
    this.maxTime = 0;
    console.log(this.isTimed);
    return this.isTimed;
  }

  getIsTimedUpdateListener() {
    return this.isTimedUpdated.asObservable();
  }

  // ******************************************************** //
  // *********  CONFIGURATION: MIN SCORE FUNCTIONS  ********* //
  // ******************************************************** //

  // gets the minimum score set by user in configuration
  getMinScore() {
    return this.minimumScore;
  }

  // Due to default setting, changing the score based upon a slider event
  minScoreChanged($event, value) {
    this.minimumScore = value;
    return this.minimumScore;
  }

  // ******************************************************** //
  // *********  CONFIGURATION: MAX TIME FUNCTIONS  ********** //
  // ******************************************************** //

  getMaxTime() {
    return this.maxTime;
  }

  // Due to default setting, changes the max time based upon input
  onHandleMaxTime(event: any) {
    this.maxTime = event.target.value;
    console.log(this.maxTime);
  }

  // ******************************************************** //
  // *******  CONFIGURATION: WRONG STREAK FUNCTIONS  ******** //
  // ******************************************************** //

  getWrongStreak() {
    return this.wrongStreak;
  }

  // Due to default setting, changes the wrong streak based upon input
  onHandleWrongStreak(event: any) {
    this.wrongStreak = event.target.value;
    console.log(this.wrongStreak);
  }

  // ******************************************************** //
  // ****************  QUESTION FUNCTIONS  ****************** //
  // ******************************************************** //
  getAssessmentQuestionsUpdatedListener() {
    return this.assessmentQuestionsUpdated.asObservable();
  }

  // ******************************************************** //
  // ***************  API CALLS TO BACKEND  ***************** //
  // ******************************************************** //
  // Gets all assessments from the database.
  getAllAssessments() {
    this.helperService.isLoading = true;
    this.http
      .get<{ message: string, assessments: Assessment[] }>(
        'http://localhost:3000/api/assessments'
      )
      .subscribe((assessmentData) => {
        this.assessments = assessmentData.assessments.reverse();
        console.log(this.assessments);
        // Subscribers get a copy of the assessments array
        this.assessmentsUpdated.next(this.assessments);
        // Done loading. Remove the loading spinner
        this.helperService.isLoading = false;
      },
        error => {
          // log error message from server
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  // Gets an assessment by an id
  getAssessmentById(assessmentId: string) {
    this.helperService.isLoading = true;
    this.http
      .get<{ message: string, assessment: Assessment }>(
        'http://localhost:3000/api/assessment/' + assessmentId
      )
      .subscribe((assessmentData) => {
        // mongoose always returns an array with find()
        // // grabbing the first (and only) assessment in array
        this.assessment = assessmentData.assessment[0];

        console.log('Assessment Id', this.assessment._id);
        console.log('Assessment', this.assessment);

        this.questionIds = this.assessment.questionIds;
        this.isTimed = this.assessment.config.isTimed;

        // Subscribers get a copy of the assessment.
        this.assessmentUpdated.next(this.assessment);
        // Done loading. Remove the loading spinner
        this.helperService.isLoading = false;
      });
  }

  // gets a list of questions from an array of ids
  getQuestionsByIds(questionIds: string[]) {
    this.helperService.isLoading = true;
    this.http
      .post<{ message: string, questions: Question[] }>('http://localhost:3000/api/assessment/questions/', { questionIds })
      .subscribe(
        responseData => {
          this.questions = responseData.questions;
          this.assessmentQuestionsUpdated.next(this.questions);
          // Done loading. Remove the loading spinner
          this.helperService.isLoading = false;
          console.log(responseData.message);
          console.log(responseData.questions);
        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  saveAssessment(assessment: Assessment) {
    document.getElementById('saveConfigurations').click();
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
          this.resetConfigurationForm();
          this.router.navigate(['/assessment/list']);

        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  // Makes a call to the server to update a question based on its id
  updateAssessmentById(assessment: Assessment) {
    // isLoading is used to add a spinner
    this.helperService.isLoading = true;
    document.getElementById('updateConfigurations').click();
    const updatedAssessment: any = assessment;
    updatedAssessment.config = this.assessmentConfig;
    updatedAssessment.status = this.status;
    console.log('Updated Assessment', updatedAssessment);
    this.http.post<{ message: string, updatedAssessment: Assessment}>('http://localhost:3000/api/assessment/update', updatedAssessment)
    .subscribe(
      responseData => {
        // Success message at the bottom of the screen
        // console log information about the response for debugging
        this.helperService.openSnackBar(assessment.name + ' Updated Successfully!', 'Close', 'success-dialog', 5000);

        setTimeout(() => {
          this.router.navigate(['/assessment/list']);
          // reset the isLoading spinner
          this.helperService.isLoading = false;
        }, 2000);
        console.log('%c' + responseData.message, 'color: green;');
        console.log('%c Database Object:', 'color: orange;');
        console.log(responseData.updatedAssessment);
        console.table(responseData.updatedAssessment);
      },
      error => {
        // log error message from server
        console.log('%c' + error.error.message, 'color: red;');
      }
    );
  }

}
