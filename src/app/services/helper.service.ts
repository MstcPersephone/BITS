import { Injectable } from '@angular/core';
import { QuestionType } from '../enums/questionType.enum';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private snackBar: MatSnackBar) { }

  // Converts the QuestionType enum to an array of objects
  // key is the enum name and value is its text value
  // Example: QuestionType.MultipleChoice turns into {key: MultipleChoice, value: "Multiple Choice"}
  getQuestionTypes() {
    const questionTypeKeys = Object.values(QuestionType);
    const questionTypeValues = Object.values(QuestionType);
    const questionTypeArray = [];

    questionTypeKeys.forEach((questionTypeKey, index) => {
      questionTypeArray.push({key: questionTypeKey, value: questionTypeValues[index]});
    });
    return questionTypeArray;
  }

  // Converts string to a boolean
  convertToTrueFalse(booleanValue: string) {
    return booleanValue.toString().toLowerCase() === 'true' ? true : false;
  }

  // Opens a snack bar for successfully saving a question.
  openSnackBar(message: string, action: string, classString: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: classString
    });
  }
}
