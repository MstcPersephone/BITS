import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Option } from '../models/shared/option.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private questions: Question[] = [];
  private questionsUpdated = new Subject<Question[]>();

  constructor(private http: HttpClient) { }

  // Starts the create question wizard
  createQuestion() {

  }

  // Starts the create option wizard
  createOption() {

  }

  // Starts the edit option wizard
  editOption(option: Option) {

  }

  // Starts the edit question wizard
  editQuestion(question: Question) {

  }

  // Gets the updateListener subject
  getQuestionsUpdatedListener() {
    return this.questionsUpdated.asObservable();
  }

  getAllQuestions() {
    this.http.get<{message: string, questions: Question[]}>('http://localhost:3000/api/questions')
    .subscribe((questionData) => {
      this.questions = questionData.questions;
      this.questionsUpdated.next([...this.questions]);
    });
  }

  // Saves the question to the database
  saveQuestion(question: Question) {

  }

  // Saves the option to the database
  saveOption(option: Option) {

  }
}
