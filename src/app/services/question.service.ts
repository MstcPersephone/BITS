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
import { ShortAnswer } from '../models/question-types/short-answer.model';

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

  // Question (for edit and delete) and subject
  private question: Question;
  private questionUpdated = new Subject<Question>();

  constructor(private http: HttpClient, private helperService: HelperService) { }

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
    console.log('%c Deleting Option', 'color: red');
    this.options.splice(i, 1);
    console.table(this.options);
    this.optionsUpdated.next([...this.options]);
  }

  deleteMatch(i) {
    console.log('%c Deleting Exact Match', 'color: red');
    this.exactMatches.splice(i, 1);
    console.table(this.exactMatches);
    this.exactMatchesUpdated.next([...this.exactMatches]);
  }

  // Gets a copy of the options.
  // Used for attaching the options to a question before saving it.
  getOptions() {
    return [...this.options];
  }

  // Gets copy of the matches.
  // Used for attaching the matches to a question before saving it.
  getMatches() {
    return [...this.exactMatches];
  }

  // Returns whether or not the question has options.
  hasOptions() {
    return this.options.length > 0;
  }

  // Returns whether the question has matches.
  hasMatches() {
    return this.exactMatches.length > 0;
  }

  // Starts the edit option wizard
  editOption(option: Option) {

  }

  // Starts the edit question wizard
  editQuestion(question: Question) {

  }

  // Gets the updateListener subject for single question fetch
  getQuestionUpdatedListener() {
    return this.questionUpdated.asObservable();
  }

  // Gets the updateListener subject for multiple questions fetch
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

  // Gets a question by an id
  getQuestionById(questionId: string) {
    this.http
      .get<{ message: string, question: Question }>(
        'http://localhost:3000/api/question/' + questionId
      )
      .subscribe((questionData) => {
        // mongoose always returns an array with find()
        // grabbing the first (and only) question in array
        this.question = questionData.question[0];
        // Subscribers get a copy of the questions array sorted by question text.
        this.questionUpdated.next(this.question);
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
      const completeQuestion = question.questionType === QuestionType.CheckBox ? question as Checkbox : question as MultipleChoice;
      completeQuestion.options = this.getOptions();
      this.clearOptions();
      console.log(completeQuestion);
    }
    this.http.post<{ message: string, question: Question }>('http://localhost:3000/api/question/save', question)
      .subscribe(
        responseData => {
          this.helperService.openSnackBar(question.questionType + ' Question Saved Successfully!', 'Close', 'success-dialog', 5000);
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.question);
          console.table(responseData.question.attachments);
        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }

  // Returns the question type of a question
  getQuestionType(question: Question) {
    return question.questionType;
  }

  // Casting question to questionType for casting in html template.
  asCheckbox(val): Checkbox { return val; }
  asTrueFalse(val): TrueFalse { return val; }
  asMultipleChoice(val): MultipleChoice { return val; }
  asShortAnswer(val): ShortAnswer { return val; }
  asUpload(val): Upload { return val; }
}
