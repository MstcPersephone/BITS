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
import { Category } from '../models/shared/category.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {

  // Questions array and subect.
  private questions: Question[] = [];
  private questionsUpdated = new Subject<Question[]>();

  // Category array and subject.
  private categories: Category[] = [];
  public selectedCategories: Category[] = [];
  private categoriesUpdated = new Subject<Category[]>();
  private categoriesLoaded = false;
  private showHideCreateCategory = false;

  // Exact match array and subject.
  private exactMatches: ExactMatch[] = [];
  private exactMatchesUpdated = new Subject<ExactMatch[]>();
  private hasMatches = false;
  public showCreateMatch = false;

  // Options array and subject.
  private options: Option[] = [];
  private optionsUpdated = new Subject<Option[]>();
  private hasOptions = false;
  public showCreateOption = false;

  // Points.
  private enteredPoints = 0;

  // Question (for edit and delete) and subject
  private question: Question;
  private questionUpdated = new Subject<Question>();

  constructor(
    private http: HttpClient,
    private helperService: HelperService) { }

  // ************************************************************** //
  // Casting question to questionType for casting in html template. //
  // ************************************************************** //
  asCheckbox(val): Checkbox { return val; }
  asTrueFalse(val): TrueFalse { return val; }
  asMultipleChoice(val): MultipleChoice { return val; }
  asShortAnswer(val): ShortAnswer { return val; }
  asUpload(val): Upload { return val; }

  // ****************************************************** //
  // ******************Category Functions****************** //
  // ****************************************************** //

  // Gets all categories from the database.
  getAllCategories() {
    this.http
      .get<{ message: string, categories: Category[] }>(
        'http://localhost:3000/api/categories'
      )
      .subscribe((categoryData) => {
        this.categories = categoryData.categories;
        console.log(this.categories);
        this.categoriesLoaded = true;
        // Subscribers get a copy of the questions array sorted by question type.
        this.categoriesUpdated.next([...this.categories.sort((a, b) => (a.name > b.name) ? 1 : -1)]);
      });
  }

  // Returns the category subject as observable.
  // Used to subscribe to changes in categories array.
  getCategoriesListener() {
    return this.categoriesUpdated.asObservable();
  }

  // Returns whether the categories loaded to a list.
  getCategoriesLoaded() {
      return this.categoriesLoaded;
  }

  getShowHideCreateCategory() {
    return this.showHideCreateCategory;
  }

  // Updates the selectedCategories array with the values selected by the user.
  onHandleCategory(event: any, selectObject: any, selectCategoriesForm: any) {
    if (event.value[0] === 'create') {
      // Show create category
      this.showHideCreateCategory = true;

      console.log(event.source);
      // Finds the first item in the select array (create new) and unchecks it.
      // event.source.selected[0]._selected = false;

      // Closes select drop down list
      selectObject._panelOpen = false;

      // Resets the checkboxes
      selectCategoriesForm.reset();

      // Resets selected categories
      this.selectedCategories = [];

    } else {
      this.selectedCategories = event.value;
    }

    console.log(this.selectedCategories);
  }

  // Saves the category to the database
  saveCategory(category: Category, createCategoryForm) {
    // Hide the form to create a new category
    this.showHideCreateCategory = false;
    this.http.post<{ message: string, category: Category }>('http://localhost:3000/api/categories/save', category)
      .subscribe(
        responseData => {
          this.helperService.openSnackBar(category.name + ' Category Saved Successfully!', 'Close', 'success-dialog', 5000);
          console.log('%c' + responseData.message, 'color: green;');
          console.log('%c Database Object:', 'color: orange;');
          console.log(responseData.category);
          this.getAllCategories();
          createCategoryForm.reset();
        },
        error => {
          console.log('%c' + error.error.message, 'color: red;');
        });
  }


  // ****************************************************** //
  // *****************Exact Match Functions**************** //
  // ****************************************************** //
  // Resets the options array for a new question.
  clearMatches() {
    this.exactMatches = [];
  }

  // Pushes the match to the matches array and updates the subject for subscribers to consume.
  createExactMatch(exactMatch: ExactMatch) {
    this.exactMatches.push(exactMatch);
    this.exactMatchesUpdated.next([...this.exactMatches]);
  }

  // Removes an exact match from the list based on its index
  deleteMatch(i) {
    console.log('%c Deleting Exact Match', 'color: red');
    this.exactMatches.splice(i, 1);
    console.table(this.exactMatches);
    this.exactMatchesUpdated.next([...this.exactMatches]);
  }

  // Gets copy of the matches.
  // Used for attaching the matches to a question before saving it.
  getMatches() {
    return [...this.exactMatches];
  }

  // Returns the exact match subject as observable.
  // Used to subscribe to changes in exact matches array.
  getMatchesListener() {
    return this.exactMatchesUpdated.asObservable();
  }

    // Returns whether or not the question has matches.
    getHasMatchess() {
      return this.hasMatches;
    }

    // Toggles whether to show create exact match.
    toggleCreateMatch() {
      this.showCreateMatch = !this.showCreateMatch;
    }

    // Finds the match in the array and updates its value.
    updateMatch(originalMatch: ExactMatch, newMatch: ExactMatch) {
      if (newMatch.matchText === '') {
        newMatch.matchText = originalMatch.matchText;
      }

      // Finding the index of the original match
      const index = this.exactMatches.indexOf(originalMatch);

      // Replacing old match with new match
      this.exactMatches[index] = newMatch;
    }

  // ******************************************** //
  // ************Option Functions**************** //
  // ******************************************** //
  // Resets the options array for a new question.
  clearOptions() {
    this.options = [];
  }

  // Pushes the option to the options array and updates the subject for subscribers to consume.
  createOption(option: Option) {
    this.options.push(option);
    this.optionsUpdated.next([...this.options]);
  }

  // Removes an option from the list based on its index
  deleteOption(i) {
    console.log('%c Deleting Option', 'color: red');
    this.options.splice(i, 1);
    console.table(this.options);
    this.optionsUpdated.next([...this.options]);
  }

  // Gets a copy of the options.
  // Used for attaching the options to a question before saving it.
  getOptions() {
    return [...this.options];
  }

  // Returns the option subject as an observable.
  // Used to subscribe to changes in options array.
  getOptionsListener() {
    return this.optionsUpdated.asObservable();
  }

  // Returns whether or not the question has options.
  getHasOptions() {
    return this.hasOptions;
  }

  // Toggles whether to show create option.
  toggleCreateOption() {
    this.showCreateOption = !this.showCreateOption;
  }

  // Finds the option in the array and updates its value.
  updateOption(originalOption: Option, newOption: Option) {
    if (newOption.optionText === '') {
      newOption.optionText = originalOption.optionText;
    }

    // Finding the index of the original option
    const index = this.options.indexOf(originalOption);

    // Replacing old option with new option
    this.options[index] = newOption;
  }


  // ********************************************** //
  // **************Points Functions**************** //
  // ********************************************** //

  onHandlePoints(event: any) {
    this.enteredPoints = event.target.value;
    console.log(this.enteredPoints);
  }

  // ********************************************** //
  // ************Question Functions**************** //
  // ********************************************** //
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
        // Add the selected categories to the array
        this.selectedCategories = this.question.categories;

        console.log(this.selectedCategories);
        // Add options to options array if question type supports it
        if (this.question.questionType === QuestionType.CheckBox) {
          this.options = (this.question as Checkbox).options;
          console.log(this.question);
          if (this.options.length > 0) {
            this.hasOptions = true;
          }
          console.log(this.options);
          // subscribers get a copy of the options associated with the question
          this.optionsUpdated.next(this.options);
        }
        console.log(this.question.attachments);
        // this.attachmentService.attachments = this.question.attachments.length > 0 ? this.question.attachments : [];

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

  // Returns the question type of a question
  getQuestionType(question: Question) {
    return question.questionType;
  }

  // Saves the question to the database
  saveQuestion(question: Question) {
    if (question.questionType === QuestionType.CheckBox || question.questionType === QuestionType.MultipleChoice) {
      const completeQuestion = question.questionType === QuestionType.CheckBox ? question as Checkbox : question as MultipleChoice;
      completeQuestion.options = this.getOptions();
      console.log(completeQuestion);
    }

    console.log(this.selectedCategories);
    question.categories = this.selectedCategories;
    question.points = this.enteredPoints;
    this.http.post<{ message: string, question: Question }>('http://localhost:3000/api/question/save', question)
      .subscribe(
        responseData => {
          this.clearOptions();
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

  updateQuestionById(question) {
    question.categories = this.categories;
    this.http.post<{ message: string, updatedQuestion: Question}>('http://localhost:3000/api/question/update', question)
    .subscribe(
      responseData => {
        this.helperService.openSnackBar(question._id + ' Question Updated Successfully!', 'Close', 'success-dialog', 5000);
        console.log('%c' + responseData.message, 'color: green;');
        console.log('%c Database Object:', 'color: orange;');
        console.log(responseData.updatedQuestion);
        console.table(responseData.updatedQuestion);
      },
      error => {
        console.log('%c' + error.error.message, 'color: red;');
      }
    );
  }
}
