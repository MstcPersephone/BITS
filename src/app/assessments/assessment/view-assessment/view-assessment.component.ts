import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { Question } from 'src/app/models/question.interface';
import { QuestionService } from 'src/app/services/question.service';
import { Router } from '@angular/router';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrls: ['./view-assessment.component.css']
})
export class ViewAssessmentComponent implements OnInit, AfterViewInit {
  questions: Question[];
  question: Question;
  assessment: Assessment;
  id = this.route.snapshot.params.assessmentId;
  private questionsSubscription: Subscription;
  private assessmentSubscription: Subscription;
  public displayedColumns: string[] = ['questionType', 'questionText', 'points'];
  public dataSource = new MatTableDataSource<Question>();
  public columnsToDisplay = ['questionType', 'questionText', 'points'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.assessmentService.getAssessmentById(this.route.snapshot.params.assessmentId);
    this.assessmentSubscription = this.assessmentService.getAssessmentUpdateListener()
      .subscribe((assessment: Assessment) => {
        this.assessment = assessment;
        console.log('Assessment by Id', this.assessment);

        this.assessmentService.getQuestionsByIds(this.assessmentService.questionIds);
        this.questionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
          .subscribe((questionsArray: any) => {
            this.dataSource.data = questionsArray;
            console.table(this.dataSource.data);

            // this.dataSource.data.forEach((data) => {
            //   switch (data.questionType) {
            //     case 'Checkbox': return 'Checkbox';
            //     case 'Multiple Choice': return 'Multiple Choice';
            //     case 'Short Answer': return 'Short Answer';
            //     case 'True False': return 'True False';
            //     case 'Upload': return 'Upload';

            //     default: return this.dataSource.data;
            //     }
            // });

            this.dataSource.sort = this.sort;
          });
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  reloadOriginalOrder(id) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['assessment/view/:' + id]);
    });
  }


}
