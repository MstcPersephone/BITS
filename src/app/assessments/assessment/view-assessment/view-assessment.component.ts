import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Assessment } from 'src/app/models/assessment.model';
import { AssessmentConfig } from 'src/app/models/assessment-config.model';
import { AssessmentService } from 'src/app/services/assessment.service';
import { Question } from 'src/app/models/question.interface';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrls: ['./view-assessment.component.css']
})
export class ViewAssessmentComponent implements OnInit {
  questions: Question[];
  assessment: Assessment;
  private questionsSubscription: Subscription;
  private assessmentSubscription: Subscription;

  constructor(
    public questionService: QuestionService,
    public assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.assessmentService.getAssessmentById(this.route.snapshot.params.assessmentId);
    this.assessmentSubscription = this.assessmentService.getAssessmentUpdateListener()
      .subscribe((assessment: Assessment) => {
        this.assessment = assessment;
        console.log('Assessment by Id', this.assessment);

      //   this.assessmentService.getQuestionsByIds(this.route.snapshot.params.questionIds);
      //   this.questionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
      // .subscribe((questions: Question[]) => {
      //   this.questions = questions;
      //   console.log('Questions by Id', this.questions);
      // });

      });


  }
}
