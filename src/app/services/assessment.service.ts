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

  // Assessment properties
  private assessment: Assessment;

  // Category properties
  public selectedCategory: Category;
  public selectedName: any;
  private configuration: AssessmentConfig;
  public selectedCategoryName: string;

  // Configuration Properties
  isRandom = false;
  isTimed = false;
  private enteredMaxTime = 0;
  private enteredWrongStreak = 0;
  minimumScore = 75;
  private maxTimeUpdated = new Subject<number>();
  private wrongStreakUpdated = new Subject<number>();
  private configurationUpdated = new Subject<AssessmentConfig>();
  private assessmentConfig: AssessmentConfig;

  // Question properties
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

  getAssessmentQuestionsUpdatedListener() {
    return this.assessmentQuestionsUpdated.asObservable();
  }

  // HTTP request still needs to be built
  saveAssessment(assessment: Assessment) {

    const completeAssessment: any = assessment;
    completeAssessment.config = this.getAssessmentConfiguration();

    // Added the configuration properties that manage it
    // this.assessment.config.duration = null;
    // this.assessment.config.maxTime = this.enteredMaxTime;
    // this.assessment.config.wrongStreak = this.enteredWrongStreak;
    console.log(assessment);
    this.router.navigate(['/question/list']);
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
    return updatedConfigurationItems;
  }

  getConfigurationUpdatedListener() {
    return this.configurationUpdated.asObservable();
  }

  getAssessmentConfiguration() {
    return this.getConfigurationUpdatedListener();
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
  // **********  CONFIGURATION: ISTIMED FUNCTIONS  ********** //
  // ******************************************************** //

  // gets the minimum score set by user in configuration
  getMinScore() {
    return this.minimumScore;
  }

  // gets the changed score based upon slider event
  minScoreChanged($event, value) {
    this.minimumScore = value;
    return this.minimumScore;
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
}
