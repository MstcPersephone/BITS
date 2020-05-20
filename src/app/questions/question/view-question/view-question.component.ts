import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AssessmentEngineService } from 'src/app/services/assessment-engine.service';
import { HelperService } from 'src/app/services/helper.service';
import { Question } from 'src/app/models/question.interface';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements OnInit {
  @Input() currentQuestion: Question;
  question: Question;
  questionSubscription: Subscription;
  questions: Question[];
  questionTypes = [];
  private questionsSubscription: Subscription;
  constructor(
    private assessmentService: AssessmentService,
    public assessmentEngineService: AssessmentEngineService,
    public questionService: QuestionService,
    public helperService: HelperService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.questionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
    });

    // Sets up a question listener to get a new question
    // Gets the question based on the passed in id
    // id is passed through the URL
    this.questionSubscription = this.questionService.getQuestionUpdatedListener()
    .subscribe((question: Question) => {
      this.currentQuestion = question;

      console.log(this.currentQuestion);
    });

    const questionId = this.route.snapshot.params.questionId;

    if (questionId !== undefined) {
      this.questionService.getQuestionById(this.route.snapshot.params.questionId);
    }
  }

}
