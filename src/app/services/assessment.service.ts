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

  // ********************************* //
  // ****  ASSESSMENT PROPERTIES  **** //
  // ********************************* //
  // single assessment
  private assessment: Assessment;
  private assessmentUpdated = new Subject<Assessment>();

  // list of assessments
  private assessments: any;
  private assessmentsUpdated = new Subject<any>();

  // assessment name
  private enteredName: string;
  private enteredNameUpdated = new Subject<string>();

  // assessment description
  private enteredDescription: string;
  private enteredDescriptionUpdated = new Subject<string>();

  // status
  private status: any;

  // *********************************************** //
  // ****  ASSESSMENT CONFIGURATION PROPERTIES  **** //
  // *********************************************** //
  private assessmentConfig: AssessmentConfig;
  private assessmentConfigUpdated = new Subject<AssessmentConfig>();

   // config isRandom
  isRandom = false;
  public isRandomSelected: boolean;
  private isRandcomUpdated = new Subject<boolean>();

  // config isTimed
  isTimed = false;
  public isTimedSelected: boolean;
  private isTimedUpdated = new Subject<boolean>();

  // config maxTime
  public enteredMaxTime = 0;
  private maxTimeUpdated = new Subject<number>();

  // config wrongStreak
  public enteredWrongStreak = 0;
  private wrongStreakUpdated = new Subject<number>();

  // config minScore
  private changedMinScore = 75;
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

  changeCompleteStatus() {
    this.status = 'Complete';
  }

  changeInProgressStatus() {
    this.status = 'In Progress';
  }

  getStatus() {
    return this.status;
  }

  // ************************************************ //
  // *********  ASSESSMENT: NAME FUNCTIONS  ********* //
  // ************************************************ //

  // gets the minimum score set by user in configuration
  getEnteredName() {
    return this.enteredName;
  }

  getEnteredNameUpdatedListener() {
    return this.enteredNameUpdated.asObservable();
  }

  // ******************************************************* //
  // *********  ASSESSMENT: DESCRIPTION FUNCTIONS  ********* //
  // ******************************************************* //

  // gets the minimum score set by user in configuration
  getEnteredDescription() {
    return this.enteredDescription;
  }

  getEnteredDescriptionUpdatedListener() {
    return this.enteredDescriptionUpdated.asObservable();
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

  getAssessmentConfigUpdateListener() {
    return this.assessmentConfigUpdated.asObservable();
  }

  // ******************************************************** //
  // *********  CONFIGURATION: ISRANDOM FUNCTIONS  ********** //
  // ******************************************************** //

  getIsRandomSelected() {
    return this.isRandomSelected;
  }

  getIsRandomUpdatedListener() {
    return this.isRandcomUpdated.asObservable();
  }

  // sets the isRandom based upon a click event
  isRandomChanged() {
    this.isRandom = !this.isRandom;
    return this.isRandom;
  }

  // ******************************************************** //
  // **********  CONFIGURATION: ISTIMED FUNCTIONS  ********** //
  // ******************************************************** //
  getIsTimedSelected() {
    return this.isTimedSelected;
  }

  getIsTimedUpdatedListener() {
    return this.isTimedUpdated.asObservable();
  }

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

  // Gets an assessment by an id
  getAssessmentById(assessmentId: string) {
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


        // Add the values to the variables that manages them
        this.enteredName = this.assessment.name;
        this.enteredDescription = this.assessment.description;
        this.changedMinScore = this.assessment.config.minimumScore;
        this.isTimedSelected = this.assessment.config.isTimed;
        this.enteredMaxTime = this.assessment.config.maxTime;
        this.isRandomSelected = this.assessment.config.isRandom;
        this.enteredWrongStreak = this.assessment.config.wrongStreak;
        this.questionIds = this.assessment.questionIds;
        this.status = this.assessment.status;

        // Subscribers get a copy of the assessment.
        this.assessmentUpdated.next(this.assessment);

      });
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
