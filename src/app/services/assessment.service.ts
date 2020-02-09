import { Injectable } from '@angular/core';
import { Assessment } from '../models/assessment.model';
import { Question } from '../models/question.interface';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {

  constructor() { }

  // Generates the assessment
  startAssessment(questions: Question[]) {

  }

  // Submits the answers to the database
  submitAssessment(assessment: Assessment) {

  }
}
