import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AssessmentService } from 'src/app/services/assessment.service';
import { QuestionService } from 'src/app/services/question.service';
import { HelperService } from 'src/app/services/helper.service';
import { Assessment } from 'src/app/models/assessment.model';
import { Question } from 'src/app/models/question.interface';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrls: ['./view-assessment.component.css']
})
export class ViewAssessmentComponent implements OnInit, AfterViewInit {
  questions: Question[];
  question: Question;
  assessment: Assessment;
  // id = this.route.snapshot.params.assessmentId;
  private questionsSubscription: Subscription;
  private assessmentSubscription: Subscription;
  public displayedColumns: string[] = ['questionType', 'questionText', 'points'];
  public dataSource = new MatTableDataSource<Question>();
  public columnsToDisplay = ['questionType', 'questionText', 'points'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    public helperService: HelperService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.assessmentService.getAssessmentById(this.route.snapshot.params.assessmentId);
    this.assessmentSubscription = this.assessmentService.getAssessmentUpdateListener()
      .subscribe((assessment: Assessment) => {
        this.assessment = assessment;
        // console.log('Assessment by Id', this.assessment);
        if (this.assessment.questionIds !== null) {
        this.assessmentService.getQuestionsByIds(this.assessment.questionIds);
        }
        this.questionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
          .subscribe((questionsArray: any) => {
            this.dataSource.data = questionsArray;
            // console.table(this.dataSource.data);
            this.dataSource.sort = this.sort;
          });
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  selectRow(questionId) {
    // sets the return button to show on a single question view
    this.assessmentService.showBackButton = true;
    // takes the user to the single question view passing the current question id
    this.router.navigate(['/question/view', questionId]);
  }
}
