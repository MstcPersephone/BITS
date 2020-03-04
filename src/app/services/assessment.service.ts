import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Assessment } from '../models/assessment.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  // MOCK DATA
  public mockQuestionIds: string[] = ['5e50ba9499062123580d5245', '5e512dc2f614c627f0443d18',
  '5e53dfa22849a450c49e1fd7', '5e51fd6028869d1a14864f87'];

  private questionIds: string[];
  public questions: Question[] = [];
  private currentQuestion: Question;

  private assessmentQuestionsUpdated = new Subject<Question[]>();

  constructor(private http: HttpClient) { }

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
