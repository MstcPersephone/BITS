import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Student } from '../../models/student.model';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { HelperService } from '../../services/helper.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent implements OnInit {
  createStudentForm;
  hasStudentId = false;
  showstudentId = false;
  studentId = null;
  maxDate: Date;
  minDate: Date;
  startDate: Date;
  campusLocationSelected: string;

  constructor(
    public assessmentEngineService: AssessmentEngineService,
    public helperService: HelperService,
    private formBuilder: FormBuilder) {
    this.createStudentForm = this.formBuilder.group({
      hasStudentId: false,
      studentId: ['', [Validators.required, ValidationService.numberValidator]],
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

  hasStudentIdChanged() {
    this.hasStudentId = !this.hasStudentId;
    return this.hasStudentId;
  }

  getStudentId(studentData: any) {
    if (studentData.hasStudentId) {
      return studentData.studentId;
    } else {
      return this.helperService.generateUniqueStudentId(studentData);
    }
  }

  onSubmit(studentData) {
    const student: Student = new Student();
    student._id = null;
    student.hasStudentId = studentData.hasStudentId;
    student.studentId = this.getStudentId(studentData);
    student.firstName = studentData.firstName;
    student.lastName = studentData.lastName;
    student.dateOfBirth = studentData.dateOfBirth;
    student.campusLocation = this.campusLocationSelected;
    student.lastAssessmentDate = new Date(Date.now());
    student.previousScores = this.assessmentEngineService.getPreviousScores();

    // this.assessmentEngineService.saveStudent(student);
    console.log('Student', student);

  }

}
