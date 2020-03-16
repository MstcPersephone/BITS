import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Assessment } from '../models/assessment.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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

  private assessmentQuestionsUpdated = new Subject<Question[]>();

  constructor(private http: HttpClient) { }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    console.log('Question moved FROM: ');
    console.log(event.previousContainer.element);
    console.log(event.previousContainer.data);
    console.log('Question moved TO: ');
    console.log(event.container.element);
    console.log(event.container.data);
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
