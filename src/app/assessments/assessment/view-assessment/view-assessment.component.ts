import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
export class ViewAssessmentComponent implements OnInit, AfterViewInit, OnDestroy {
  questions: Question[];
  question: Question;
  assessment: Assessment;
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
    // Gets the assessment to view based upon id passed into url
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
          });
      });
  }

  ngAfterViewInit(): void {
    // this allows the columns to be sorted
    this.dataSource.sort = this.sort;
  }

  selectRow(questionId) {
    // sets the return button to show on a single question view
    this.assessmentService.showBackButton = true;
    // takes the user to the single question view passing the current question id
    this.router.navigate(['/question/view', questionId]);
  }

  // Reset service property values so they can be used by a new component
  // Unsubscribes component from the current observable event listeners.
  ngOnDestroy() {
    this.questionsSubscription.unsubscribe();
    this.assessmentSubscription.unsubscribe();
    this.assessmentService.resetService();
  }
}
