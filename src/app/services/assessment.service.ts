import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Assessment } from '../models/assessment.model';
import { Category } from 'src/app/models/shared/category.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  // MOCK DATA
  public mockQuestionIds: string[] = ['5e50ba9499062123580d5245', '5e512dc2f614c627f0443d18',
  '5e53dfa22849a450c49e1fd7', '5e603f2f2a61154b480ffafd', '5e6166f40a31644b543fc210', '5e6167ef0a31644b543fc218',
  '5e62b546cdf5ff1b5c73d457'];

  private questionIds: string[];
  public questions: Question[] = [];
  private currentQuestion: Question;
  public selectedCategory: Category;
  public selectedName: any;
  public configuration: AssessmentConfig;
  private assessment: Assessment;
  public isRandom: boolean;

  private assessmentQuestionsUpdated = new Subject<Question[]>();

  constructor(private http: HttpClient) { }


  getConfiguration() {}
  getDuration() {
    this.configuration.duration = null;
  }

  isRandomChanged() {
    if (this.configuration.isRandom) {
      this.configuration.isRandom = false;
    } else {
    this.configuration.isRandom = true;
    }
    console.log(this.isRandom);
  }

  getIsRandom() {
    this.isRandom = true;

  }

  getMinimumScore() {
    this.configuration.minimumScore = 0;
  }

  getWrongStreak() {
    this.configuration.wrongStreak = 5;
  }

  getStatus() {
    this.assessment.status = '';
  }

  // Sets the the available questions by category on create-assessment
  setCategoryCollections(event: any, selectObject: any, selectCategoryForm: any) {
    this.selectedCategory = event.value;
    this.selectedName = this.selectedCategory.name;
  }

  // Generates the assessment
  startAssessment(questions: Question[]) {

  }

  // Submits the answers to the database
  submitAssessment(assessment: Assessment) {

  }

  // TODO Handle submit question button
  submitAnswer(question: Question) {
    console.log(question);
  }

  getAssessmentQuestionsUpdatedListener() {
    return this.assessmentQuestionsUpdated.asObservable();
  }

  // gets a list of questions from an array of ids
  getQuestionsByIds(questionIds: string[]) {
    this.http
      .post<{ message: string, questions: Question[] }>('http://localhost:3000/api/assessment/questions/', {questionIds})
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
