import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Student } from '../../models/student.model';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { HelperService } from '../../services/helper.service';
import { ValidationService } from '../../services/validation.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent implements OnInit {
  createStudentForm;
  hasStudentId = false;
  showstudentId = false;
  studentId;
  maxDate: Date;
  minDate: Date;
  startDate: Date;
  campusLocationSelected: string;

  constructor(
    public assessmentEngineService: AssessmentEngineService,
    public helperService: HelperService,
    private formBuilder: FormBuilder) {
    this.createStudentForm = this.formBuilder.group({
      hasStudentId: '',
      firstName: ['', [Validators.required, ValidationService.alphaValidator]],
      lastName: ['', [Validators.required, ValidationService.alphaValidator]],
      dateOfBirth: ['', [Validators.required]],
      campusLocation: ['', [Validators.required]]
    });
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 0);
    this.maxDate = new Date(currentYear - 16, 0, 0);
    this.startDate = new Date(currentYear - 21, 1, 1);
  }

  ngOnInit() {

  }
  // Sets the variable for the ngSwitch statement in html file
  // Function is triggered after user selects an option
  onCampusLocationSelected(event) {
    this.campusLocationSelected = event.value;
    console.log('Campus', this.campusLocationSelected);
  }

  // Sets the value when the checkbox is clicked
  hasStudentIdChanged() {
    this.hasStudentId = !this.hasStudentId;
    if (this.hasStudentId) {
      // tslint:disable-next-line: max-line-length
      this.createStudentForm.addControl( 'studentId', new FormControl('', [ValidationService.studentIdLength, ValidationService.numberValidator]));
    } else {
      this.createStudentForm.removeControl('studentId');
    }
    return this.hasStudentId;
  }

  onSubmit(studentData) {
    const student: Student = new Student();
    student._id = null;
    student.studentId = this.hasStudentId ? studentData.studentId : '11111111';
    student.firstName = studentData.firstName;
    student.lastName = studentData.lastName;
    student.dateOfBirth = studentData.dateOfBirth;
    student.campusLocation = this.campusLocationSelected;
    student.lastAssessmentDate = new Date(Date.now());
    student.previousScores = this.assessmentEngineService.getPreviousScores();
    student.uniqueStudentIdentifier = this.helperService.generateUniqueStudentId(student);

    // Calls validation on the current form when submit button is clicked
    if (!this.createStudentForm.valid) {
      // Marks all controls as touched so error messages may populate
      (Object as any).values(this.createStudentForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    if (this.createStudentForm.valid) {
      // sets the validation in the service, if true assessment may start
      this.assessmentEngineService.setStudentFormIsValid(true);

      // Sends the data to the service to handle passing data for saving in database
      this.assessmentEngineService.saveStudent(student);
      console.log(this.createStudentForm.valid);
      // console.log(student);
    } else {
      // sets the validation in the service, if false errors must be corrected before assessment may start
      this.assessmentEngineService.setStudentFormIsValid(false);
      // console.log(this.createStudentForm.valid);
    }
  }
}
