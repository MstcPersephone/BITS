import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HelperService } from './helper.service';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentEngineService {

  // Students previous scores array and subject.
  public previousScores: any[];
  private previousScoresUpdated = new Subject<any[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private helperService: HelperService, ) { }

  // ********************************************** //
  // *********  STUDENT: PREVIOUS SCORES  ********* //
  // ********************************************** //

  // gets the minimum score set by user in configuration
  getPreviousScores() {
    return null;
  }

  getpreviousScoresUpdatedListener() {
    return this.previousScoresUpdated.asObservable();
  }

  saveStudent(student: Student) {
    console.log('Student', student);

    // this.http.post<{ message: string, student: Student }>('http://localhost:3000/api/assessment/save', student)
    //   .subscribe(
    //     responseData => {
    //       // tslint:disable-next-line: max-line-length
    //       this.helperService.openSnackBar(student.firstName + ' ' + student.lastName + ' Saved Successfully!', 'Close', 'success-dialog', 5000);
    //       console.log('%c' + responseData.message, 'color: green;');
    //       console.log('%c Database Object:', 'color: orange;');
    //       console.log(responseData.student);
    //       // this.router.navigate(['/assessment/list']);
    //     },
    //     error => {
    //       console.log('%c' + error.error.message, 'color: red;');
    //     });
  }
}
