import { Injectable } from '@angular/core';
import { QuestionType } from '../enums/questionType.enum';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public isLoading = false;

  constructor(private snackBar: MatSnackBar,
              private router: Router) { }

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

  // Opens a snack bar for displaying a quick message to the user.
  openSnackBar(message: string, action: string, classString: string, upTime: number = undefined) {
    this.snackBar.open(message, action, {
      duration: upTime,
      panelClass: classString
    });
  }

  // generic function to reroute a component by passing in the desired path
  refreshComponent(path: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
       this.router.navigate([path]);
    });
  }

  // generic function to reroute a component by passing in the desired path
  refreshComponentById(path: string, id: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
       this.router.navigate([path, id]);
    });
  }
}
