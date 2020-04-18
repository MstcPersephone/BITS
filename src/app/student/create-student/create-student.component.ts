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
      studentId: ['11111111', {
        validators: [ValidationService.studentIdLength, ValidationService.numberValidator],
        updateOn: 'blur'}],
      firstName: ['', [Validators.required, ValidationService.alphaValidator]],
      lastName: ['', [Validators.required, ValidationService.alphaValidator]],
      dateOfBirth: ['', [Validators.required]],
      campusLocation: ['', [Validators.required]]
    },
    {updateOn: 'submit'});
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
    return this.hasStudentId;
  }

  onSubmit(studentData) {
    const student: Student = new Student();



    student.hasStudentId = studentData.hasStudentId;
    student.studentId = studentData.studentId;
    student.firstName = studentData.firstName;
    student.lastName = studentData.lastName;
    student.dateOfBirth = studentData.dateOfBirth;
    student.campusLocation = this.campusLocationSelected;
    student.lastAssessmentDate = new Date(Date.now());
    student.previousScores = this.assessmentEngineService.getPreviousScores();
    student._id = this.helperService.generateUniqueStudentId(student);

    // Calls validation on the current form when submit button is clicked
    if (!this.createStudentForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.createStudentForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    if (this.createStudentForm.valid) {
      if (!this.hasStudentId) {
        // sets the validation in the service to let engine know whether ok to start
        this.assessmentEngineService.setStudentFormIsValid(true);
        console.log('Valid?', this.createStudentForm.valid);

        // Sends the data to the service to handle passing data for saving in database
        // this.assessmentEngineService.saveStudent(student);
        console.log('Simulate Save', student);
      }
    } else {
      // sets the validation in the service to let engine know whether ok to start
      this.assessmentEngineService.setStudentFormIsValid(false);
      console.log('Valid?', this.createStudentForm.valid);
    }
  }
}
