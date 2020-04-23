import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Student } from '../../models/student.model';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { HelperService } from '../../services/helper.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  editStudentForm;
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
    this.editStudentForm = this.formBuilder.group({
      studentId: ['', [ValidationService.studentIdLength, ValidationService.numberValidator]],
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

  onSubmit(studentData) {
  }
}
