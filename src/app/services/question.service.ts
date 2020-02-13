import { Injectable } from '@angular/core';
import { Option } from '../models/question-types/option.model';
import { Question } from '../models/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {

  constructor() { }

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

  // Saves the question to the database
  saveQuestion(question: Question) {

  }

  // Saves the option to the database
  saveOption(option: Option) {

  }
}
