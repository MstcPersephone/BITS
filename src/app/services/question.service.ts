import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Option } from '../models/shared/option.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';
import { QuestionType } from '../enums/questionType.enum';
import { Checkbox } from '../models/question-types/checkbox.model';


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

  constructor(private http: HttpClient) { }

  // Starts the create question wizard
  createQuestion() {

  }

  // Pushes the option to the options array and updates the subject for subscribers to consume.
  createOption(option: Option) {
    this.options.push(option);
    this.optionsUpdated.next([...this.options]);
  }

  // Returns the option subject as an observable.
  // Used to subscirbe to changes in options array.
  getOptionsListener() {
    return this.optionsUpdated.asObservable();
  }

  // Gets a copy of the options.
  // Used for attaching the options to a question before making POST request.
  getOptions() {
    return [...this.options];
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
    if (question.questionType === QuestionType.CheckBox || question.questionType === QuestionType.MultipleChoice) {
      const completeQuestion = question as Checkbox;
      completeQuestion.options = this.getOptions();
      console.log(completeQuestion);
    }
    this.http.post<{message: string}>('http://localhost:3000/api/questions/save', question)
    .subscribe(
      responseData => {
        console.log(responseData.message);
      },
      error => console.log(error.error.message));
  }

  // Saves the option to the database
  saveOption(option: Option) {

  }

  getQuestionType(question: Question) {
    return question.questionType;
  }
}
