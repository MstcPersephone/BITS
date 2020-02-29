import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Assessment } from '../models/assessment.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private question: Question;
  private questionUpdated = new Subject<Question>();

  constructor(private http: HttpClient) { }

  // Generates the assessment
  startAssessment(questions: Question[]) {

  }

  // Submits the answers to the database
  submitAssessment(assessment: Assessment) {

  }

  //
  getQuestionUpdatedListener() {
    return this.questionUpdated.asObservable();
  }

  // Gets a question by an id
  getQuestionById(questionId: string) {
    this.http
      .get<{ message: string, question: Question }>(
        'http://localhost:3000/api/question/' + questionId
      )
      .subscribe((questionData) => {
        const currentQuestion = questionData.question;
        // Subscribers get a copy of the questions array sorted by question text.
        this.questionUpdated.next(this.question);
      });
  }
}
