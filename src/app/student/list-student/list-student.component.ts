import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Student } from '../../models/student.model';
import { TakenAssessment } from 'src/app/models/taken-assessment.model';
import { AssessmentEngineService } from '../../services/assessment-engine.service';
import { HelperService } from '../../services/helper.service';


@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit, OnDestroy {
  findStudentForm;
  maxDate: Date;
  minDate: Date;
  startDate: Date;
  showTableData = false;
  private takenAssessmentsSubscription: Subscription;
  // tslint:disable-next-line: max-line-length
  public displayedColumns: string[] = ['studentId', 'campusLocation', 'studentName', 'dateOfBirth', 'score', 'studentPassed', 'modifiedOn', 'assessmentName', 'detailLink'];
  public dataSource = new MatTableDataSource<TakenAssessment>();
  // tslint:disable-next-line: max-line-length
  public columnsToDisplay = ['studentId', 'campusLocation', 'studentName', 'dateOfBirth', 'score', 'studentPassed', 'modifiedOn', 'assessmentName', 'detailLink'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;



  constructor(
    private route: ActivatedRoute,
    public assessmentEngineService: AssessmentEngineService,
    public helperService: HelperService,
    private formBuilder: FormBuilder) {
    this.findStudentForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      studentId: '',
      dateOfBirth: '',
    });
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 0);
    this.maxDate = new Date(currentYear - 16, 0, 0);
    this.startDate = new Date(currentYear - 21, 1, 1);
  }

  ngOnInit() {
    const params = this.route.snapshot.params;

    if (params.searchParameters !== undefined && params.searchParameters !== '') {
      this.assessmentEngineService.searchParameters = this.helperService.convertSearchParametersToArray(params.searchParameters);
    }

    if (this.assessmentEngineService.searchParameters !== undefined && this.assessmentEngineService.searchParameters.length > 0) {
      this.assessmentEngineService.getFilteredTakenAssessment(this.assessmentEngineService.searchParameters);
      this.takenAssessmentsSubscription = this.assessmentEngineService.getTakenAssessmentsUpdateListener()
        .subscribe((takenAssessmentArray: any) => {
          this.dataSource.data = takenAssessmentArray;
          console.log(this.dataSource.data);
          this.showTableData = true;
        });

    } else {
      this.showTableData = false;
    }

    // Scrolls the window down to the table on page load (does not work for direct URL)
    const tableEl = document.getElementById('resultsTable');
    if (tableEl != null) {
      tableEl.scrollIntoView();
    }
  }

  ngOnDestroy() {
    this.showTableData = false;
  }

  clearForm() {
    this.showTableData = false;
    this.findStudentForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      studentId: '',
      dateOfBirth: '',
    });
  }

  onSubmit(studentData) {
    this.showTableData = true;
    console.log('Student Data', studentData);
    studentData.firstName = this.helperService.convertName(studentData.firstName);
    studentData.lastName = this.helperService.convertName(studentData.lastName);
    if (studentData.dateOfBirth !== '') {
      studentData.dateOfBirth = this.helperService.convertBirthdateToNumbers(studentData.dateOfBirth);
    }
    const searchParameters: string[] = [];
    Object.keys(studentData).forEach((key) => {
      if (studentData[key] !== '') {
        searchParameters.push(studentData[key]);
      }
    });

    console.log(searchParameters);

    this.assessmentEngineService.searchParameters = searchParameters;

    this.assessmentEngineService.getFilteredTakenAssessment(searchParameters);
    this.takenAssessmentsSubscription = this.assessmentEngineService.getTakenAssessmentsUpdateListener()
      .subscribe((takenAssessmentArray: any) => {
        this.dataSource.data = takenAssessmentArray;
        console.log(this.dataSource.data);
      });

    this.dataSource.sort = this.sort;
  }

  getSearchParametersAsString() {
    const sp = this.assessmentEngineService.searchParameters;
    if (sp.length > 0) {
      return this.helperService.convertSearchParametersToString(sp);
    } else {
      return '';
    }
  }

}
