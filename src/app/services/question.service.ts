import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Option } from '../models/shared/option.model';
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

  constructor(private http: HttpClient, private helperService: HelperService) { }

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

  // Resets the options array for a new question.
  clearOptions() {
    this.options = [];
  }

  // Removes an option from the list based on its index
  deleteOption(i) {
    this.options.splice(i);
  }

  // Gets a copy of the options.
  // Used for attaching the options to a question before making POST request.
  getOptions() {
    return [...this.options];
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
    .get<{message: string, questions: Question[]}>(
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
    .get<{message: string, questions: Question[]}>(
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
    this.http.post<{message: string, question: Question}>('http://localhost:3000/api/questions/save', question)
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
