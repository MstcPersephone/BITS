import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  searchParameters = '';
  editStudentForm;
  studentSubscription: Subscription;
  student: Student;
  maxDate: Date;
  minDate: Date;
  startDate: Date;
  selected;
  campusLocationSelected: string;


  constructor(
    private route: ActivatedRoute,
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
    const params = this.route.snapshot.params;
    console.log('searchParamters', params.searchParameters);
    // If search parameters where passed, store them.
    if (params.searchParameters !== '') {
      this.searchParameters = params.searchParameters;
    }

    this.studentSubscription = this.assessmentEngineService.getCurrentStudentUpdateListener()
      .subscribe((student: Student) => {
        this.student = student;
        this.selected = this.student.campusLocation;
        this.campusLocationSelected = this.student.campusLocation;

        this.editStudentForm.setValue({
          studentId: String(this.student.studentId),
          campusLocation: String(this.selected),
          firstName: String(this.student.firstName),
          lastName: String(this.student.lastName),
          dateOfBirth: String(this.student.dateOfBirth)
        });
      });
    this.assessmentEngineService.getStudentbyId(this.route.snapshot.params.studentsId);
  }

  // Sets the variable for the ngSwitch statement in html file
  // Function is triggered after user selects an option
  onCampusLocationSelected(event) {
    this.campusLocationSelected = event.value;
    console.log('Campus', this.campusLocationSelected);
  }

  onSubmit(studentData) {
    const updatedStudent: Student = new Student();

    // Calls validation on the current form when submit button is clicked
    if (!this.editStudentForm.valid) {
      // Marks all controls as touched so error messages may populate
      (Object as any).values(this.editStudentForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    if (this.editStudentForm.valid) {
      updatedStudent._id = this.student._id;
      updatedStudent.studentId = studentData.studentId;
      updatedStudent.firstName = studentData.firstName;
      updatedStudent.lastName = studentData.lastName;
      updatedStudent.dateOfBirth = studentData.dateOfBirth;
      updatedStudent.campusLocation = this.campusLocationSelected;
      updatedStudent.lastAssessmentDate = this.student.lastAssessmentDate;
      updatedStudent.previousScores = this.student.previousScores;
      updatedStudent.uniqueStudentIdentifier = this.helperService.generateUniqueStudentId(updatedStudent);

      // Sends the data to the service to handle passing data for saving in database
      this.assessmentEngineService.updateStudent(updatedStudent);
    }
  }
}
