import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AssessmentService } from '../../../services/assessment.service';
import { QuestionService } from '../../../services/question.service';
import { Subscription } from 'rxjs';
import { Assessment } from 'src/app/models/assessment.model';
import { Question } from 'src/app/models/question.interface';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css']
})

export class AssessmentListComponent implements OnInit, AfterViewInit {
  questions: Question[] = [];
  private questionsSubscription: Subscription;
  private assessmentsSubscription: Subscription;
  public displayedColumns: string[] = ['name', 'description', 'status', 'view'];
  public dataSource = new MatTableDataSource<Assessment>();
  public columnsToDisplay = ['name', 'description', 'status', 'view'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public assessmentService: AssessmentService,
    public questionsService: QuestionService,
    private router: Router) { }

  ngOnInit() {
    this.assessmentService.getAllAssessments();
    this.assessmentsSubscription = this.assessmentService.getAssessmentsUpdateListener()
      .subscribe((assessmentArray: any) => {
        this.dataSource.data = assessmentArray;
        console.table(this.dataSource.data);
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

}
