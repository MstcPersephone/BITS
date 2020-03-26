import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { Student } from '../../models/student.model';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent implements OnInit {
  createStudentForm;
  maxDate: Date;
  minDate: Date;
  startDate: Date;
  campusLocationSelected: string;

  constructor(
    public assessmentEngineService: AssessmentEngineService,
    public helperService: HelperService,
    private formBuilder: FormBuilder) {
    this.createStudentForm = this.formBuilder.group({
      studentId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      campusLocation: ''
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

  onSubmit(studentData) {
    const student: Student = new Student();
    student._id = null;
    student.studentId = studentData.studentId;
    student.firstName = studentData.firstName;
    student.lastName = studentData.lastName;
    student.dateOfBirth = studentData.dateOfBirth;
    student.campusLocation = this.campusLocationSelected;
    student.lastAssessmentDate = new Date(Date.now());
    student.previousScores = this.assessmentEngineService.getPreviousScores();

    this.assessmentEngineService.saveStudent(student);
  }

}
