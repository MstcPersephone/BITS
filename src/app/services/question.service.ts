import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Option } from '../models/shared/option.model';
import {ExactMatch } from '../models/shared/exact-match.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';
import { QuestionType } from '../enums/questionType.enum';


@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  // Questions array and subect.
  private questions: Question[] = [];
  private questionsUpdated = new Subject<Question[]>();

  // Options array and subject.
  private options: Option[] = [];
  private optionsUpdated = new Subject<Option[]>();

  // Exact match array and subject.
  private exactMatches: ExactMatch[] = [];
  private exactMatchesUpdated = new Subject<ExactMatch[]>();

  constructor(private http: HttpClient) { }

  // Starts the create question wizard
  createQuestion() {

  }

  // Pushes the option to the options array and updates the subject for subscribers to consume.
  createOption(option: Option) {
    this.options.push(option);
    this.optionsUpdated.next([...this.options]);
  }

    // Pushes the match to the matches array and updates the subject for subscribers to consume.
    createExactMatch(exactMatch: ExactMatch) {
      this.exactMatches.push(exactMatch);
      this.exactMatchesUpdated.next([...this.exactMatches]);
    }

  // Returns the option subject as an observable.
  // Used to subscribe to changes in options array.
  getOptionsListener() {
    return this.optionsUpdated.asObservable();
  }

  // Returns the exact match subject as observable.
  // Used to subscribe to changes in exact matches array.
  getMatchesListener() {
    return this.exactMatchesUpdated.asObservable();
  }

  // Gets a copy of the options.
  // Used for attaching the options to a question before making POST request.
  getOptions() {
    return [...this.options];
  }

  // Gets copy of the matches.
  // Used for attaching the matches to a question before making POST request.
  getMatches() {
    return [...this.exactMatches];
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
    this.http
    .get<{message: string, questions: Question[]}>(
      'http://localhost:3000/api/questions'
    )
    .subscribe((questionData) => {
      this.questions = questionData.questions;
      this.questionsUpdated.next([...this.questions]);
    });
  }

  // Saves the question to the database
  saveQuestion(question: Question) {
    this.http.post<{message: string}>('http://localhost:3000/api/questions/save', question)
    .subscribe(responseData => {
      console.log(responseData.message);
    });
  }

  // Saves the option to the database
  saveOption(option: Option) {

  }

  getQuestionType(question: Question) {
    return question.questionType;
  }
}
