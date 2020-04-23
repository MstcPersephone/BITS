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
    this.studentSubscription = this.assessmentEngineService.getCurrentStudentUpdateListener()
      .subscribe((student: Student) => {
        this.student = student;
        this.selected = this.student.campusLocation;
        console.log(this.student);
        if (this.student !== undefined) {
          // this.editStudentForm.get('studentId').setValue(this.student.studentId);
          this.editStudentForm.setValue({studentId: String(this.student.studentId) });
          this.editStudentForm.setValue({campusLocation: String(this.selected) });
          this.editStudentForm.setValue({firstName: String(this.student.firstName) });
          this.editStudentForm.setValue({lastName: String(this.student.lastName) });
          this.editStudentForm.setValue({dateOfBirth: String(this.student.dateOfBirth) });
        }
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
  }
}
