import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Option } from '../models/shared/option.model';
import { ExactMatch } from '../models/shared/exact-match.model';
import { Question } from '../models/question.interface';
import { Subject } from 'rxjs';
import { QuestionType } from '../enums/questionType.enum';
import { Checkbox } from '../models/question-types/checkbox.model';
import { HelperService } from './helper.service';
import { TrueFalse } from '../models/question-types/true-false.model';
import { MultipleChoice } from '../models/question-types/multiple-choice.model';
import { Upload } from '../models/question-types/upload.model';

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

  constructor(private http: HttpClient, private helperService: HelperService) { }

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

  // Resets the options array for a new question.
  clearOptions() {
    this.options = [];
  }

  // Resets the options array for a new question.
  clearMatches() {
    this.exactMatches = [];
  }

  // Removes an option from the list based on its index
  deleteOption(i) {
    this.options.splice(i);
  }

  deleteMatch(i) {
    this.exactMatches.splice(i);
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

  // Returns whether or not the question has options.
  hasOptions() {
    return this.options.length > 0;
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

  // Gets all questions from the database.
  getAllQuestions() {
    this.http
      .get<{ message: string, questions: Question[] }>(
        'http://localhost:3000/api/questions'
      )
      .subscribe((questionData) => {
        this.questions = questionData.questions;
        // Subscribers get a copy of the questions array sorted by question type.
        this.questionsUpdated.next([...this.questions.sort((a, b) => (a.questionType > b.questionType) ? 1 : -1)]);
      });
  }

  // Gets all questions of a specific type
  getQuestionsByType(questionType: QuestionType) {
    this.http
      .get<{ message: string, questions: Question[] }>(
        'http://localhost:3000/api/questions/' + questionType
      )
      .subscribe((questionData) => {
        this.questions = questionData.questions;
        // Subscribers get a copy of the questions array sorted by question text.
        this.questionsUpdated.next([...this.questions.sort((a, b) => (a.questionText > b.questionText) ? 1 : -1)]);
      });
  }

  // Saves the question to the database
  saveQuestion(question: Question) {
    if (question.questionType === QuestionType.CheckBox || question.questionType === QuestionType.MultipleChoice) {
      const completeQuestion = question as Checkbox;
      completeQuestion.options = this.getOptions();
      this.clearOptions();
      console.log(completeQuestion);
    }
    this.http.post<{ message: string, question: Question }>('http://localhost:3000/api/questions/save', question)
      .subscribe(
        responseData => {
          this.helperService.openSnackBar(question.questionType + ' Question Saved Successfully!', 'Close', 'success-dialog');
          console.log(responseData.message);
          console.log(responseData.question);
        },
        error => console.log(error.error.message));
  }

  // Returns the question type of a question
  getQuestionType(question: Question) {
    return question.questionType;
  }

  // Casting question to questionType for casting in html template.
  asCheckbox(val): Checkbox { return val; }
  asTrueFalse(val): TrueFalse { return val; }
  asMultipleChoice(val): MultipleChoice { return val; }
  asUpload(val): Upload { return val; }
}
