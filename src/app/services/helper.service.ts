import { Injectable } from '@angular/core';
import { QuestionType } from '../enums/questionType.enum';
import { Student } from '../models/student.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public isLoading = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router) { }

  // Converts the QuestionType enum to an array of objects
  // key is the enum name and value is its text value
  // Example: QuestionType.MultipleChoice turns into {key: MultipleChoice, value: "Multiple Choice"}
  getQuestionTypes() {
    const questionTypeKeys = Object.values(QuestionType);
    const questionTypeValues = Object.values(QuestionType);
    const questionTypeArray = [];

    questionTypeKeys.forEach((questionTypeKey, index) => {
      questionTypeArray.push({ key: questionTypeKey, value: questionTypeValues[index] });
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

  convertBirthdateToNumbers(birthdate) {

    // Put date string into Date object
    const unFormattedDate = new Date(birthdate);

    // Add zeros to the beginning of month or date if needed
    const monthNumbers = this.addZeroIfNeeded(unFormattedDate.getMonth() + 1);
    const dayNumbers = this.addZeroIfNeeded(unFormattedDate.getDate());
    const yearNumbers = unFormattedDate.getFullYear();

    // Return just the numbers
    return monthNumbers + dayNumbers + yearNumbers;
  }

  convertName(name) {

    // Put date string into Date object
    const convertedName = name.replace(/-|\s/g, '');

    // Return just the numbers
    return convertedName.toLowerCase();
  }

  // Add a 0 to the beginning of the day or month if needed
  // This is not currently needed with the date picker being used,
  // but if there were new functions in the future that accepted the date
  // in a text input it would be necessary
  addZeroIfNeeded(n) {
    return (n < 10) ? '0' + n : n;
  }

  generateUniqueStudentId(student: Student) {

    const firstName = this.convertName(student.firstName);
    const lastName = this.convertName(student.lastName);
    const dob = this.convertBirthdateToNumbers(student.dateOfBirth);
    const studentId = student.studentId;

    const uniqueId = [firstName, lastName, dob, studentId].join('_');

    return uniqueId;
  }
}
