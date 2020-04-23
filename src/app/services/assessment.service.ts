import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { HelperService } from './helper.service';
import { ValidationService } from './validation.service';
import { Assessment } from '../models/assessment.model';
import { Category } from 'src/app/models/shared/category.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { QuestionType } from '../enums/questionType.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  // MOCK DATA
  public mockQuestionIds: string[] = [
    '5e84ce31e673382f84b77954'
  ];

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
  public showBackButton = false; // used to show the back button on instructors view of single question
  private currentQuestionId = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private helperService: HelperService,
    public dialog: MatDialog,
    private location: Location) { }

  // ******************************************************** //
  // ***************  ASSESSMENT FUNCTIONS  ***************** //
  // ******************************************************** //

  getAssessmentUpdateListener() {
    return this.assessmentUpdated.asObservable();
  }

  getAssessmentsUpdateListener() {
    return this.assessmentsUpdated.asObservable();
  }

  // A function to allow a user to return to an assessment view after viewing a single question from table
  returnToAssessment() {
    this.showBackButton = false;
    this.location.back();
  }

  // ******************************************************** //
  // ************  ASSESSMENT ENGINE FUNCTIONS  ************* //
  // ******************************************************** //

  submitAssessment(assessment: Assessment) {
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
  setCategoryCollections(event: any) {
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

  // Archives an assessment object after confirmation from the user
  deleteAssessmentById(assessment: Assessment) {
    console.log(assessment);
    // Opens a dialog to confirm deletion of the assessment
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Are you sure you wish to delete this assessment?',
      hasBackdrop: true,
      disableClose: true,
      closeOnNavigation: true
    });
    // On closing dialog box either call the function to archive the assessment or cancel the deletion
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.helperService.isLoading = true;
        console.log(assessment);
        this.http.post<{ message: string }>(environment.apiUrl + 'assessment/delete', assessment)
          .subscribe(responseData => {
            setTimeout(() => {
              console.log(responseData);
              // Displays a message informing that the assessment deletion has been successful.
              this.helperService.openSnackBar('Assessment Deletion.', 'Close', 'success-dialog', 5000);
              this.helperService.isLoading = false;
              this.helperService.refreshComponent('assessment/list');
            }, 2000);
          },
            error => {
              console.log('%c' + error.error.message, 'color: red;');
            });
      } else {
        // Displays a message informing that the assessment deletion has been cancelled.
        this.helperService.openSnackBar('Cancelled Deletion.', 'Close', 'alert-dialog', 5000);
      }
    });
  }

  // Gets all assessments from the database.
  getAllAssessments() {
    this.helperService.isLoading = true;
    this.http
      .get<{ message: string, assessments: Assessment[] }>(
        environment.apiUrl + 'assessments'
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
        environment.apiUrl + 'assessment/' + assessmentId
      )
      .subscribe((assessmentData) => {
        // mongoose always returns an array with find()
        // // grabbing the first (and only) assessment in array
        this.assessment = assessmentData.assessment[0];

        console.log('Assessment Id', this.assessment._id);
        console.log('Assessment', this.assessment);

        this.questionIds = this.assessment.questionIds;
        this.assessmentConfig = this.assessment.config;
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
      .post<{ message: string, questions: Question[] }>(environment.apiUrl + 'assessment/questions/', { questionIds })
      .subscribe(
        responseData => {
          this.questions = responseData.questions;
          this.assessmentQuestionsUpdated.next(this.questions);
          // Done loading. Remove the loading spinner
          this.helperService.isLoading = false;
          console.log(responseData.message);
          console.log(this.questions);
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

    const wrongStreakResponse = ValidationService.validateMaxWrongStreak(completeAssessment);

    const maxTimeResponse = ValidationService.validateMaxTime(completeAssessment.config);


    if (wrongStreakResponse.result && maxTimeResponse.result) {

      console.log('Complete Assessment', completeAssessment);

      this.http.post<{ message: string, assesment: Assessment }>(environment.apiUrl + 'assessment/save', completeAssessment)
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
    } else if (!wrongStreakResponse.result) {
      this.helperService.openSnackBar(wrongStreakResponse.message, 'OK', 'error-dialog', undefined);
    } else if (!maxTimeResponse.result) {
      this.helperService.openSnackBar(maxTimeResponse.message, 'OK', 'error-dialog', undefined);
    }
  }

  // Makes a call to the server to update an assessment
  updateAssessmentById(assessment: Assessment) {
    // isLoading is used to add a spinner
    this.helperService.isLoading = true;
    document.getElementById('updateConfigurations').click();
    assessment.config = this.assessmentConfig;
    assessment.status = this.status;
    console.log('Updated Assessment', assessment);

    const wrongStreakResponse = ValidationService.validateMaxWrongStreak(assessment);

    const maxTimeResponse = ValidationService.validateMaxTime(assessment.config);

    if (wrongStreakResponse.result && maxTimeResponse.result) {
      this.http.post<{ message: string, updatedAssessment: Assessment }>(environment.apiUrl + 'assessment/update', assessment)
        .subscribe(
          responseData => {
            // Success message at the bottom of the screen
            // console log information about the response for debugging
            this.helperService.openSnackBar(assessment.name + ' Updated Successfully!', 'Close', 'success-dialog', 5000);

            setTimeout(() => {
              this.helperService.refreshComponentById('assessment/view', assessment._id);
              // this.router.navigate(['/assessment/view', assessment._id]);
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
          });
    } else if (!wrongStreakResponse.result) {
      this.helperService.openSnackBar(wrongStreakResponse.message, 'OK', 'error-dialog', undefined);
      this.helperService.isLoading = false;
    } else if (!maxTimeResponse.result) {
      this.helperService.openSnackBar(maxTimeResponse.message, 'OK', 'error-dialog', undefined);
      this.helperService.isLoading = false;
    }
  }

}
