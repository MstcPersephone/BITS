import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { AssessmentService } from 'src/app/services/assessment.service';
import { HelperService } from 'src/app/services/helper.service';
import { Question } from 'src/app/models/question.interface';


@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements OnInit {
  question: Question;
  questionSubscription: Subscription;
  questions: Question[];
  currentQuestion: Question;
  questionTypes = [];
  private questionsSubscription: Subscription;
  constructor(
    private assessmentService: AssessmentService,
    public questionService: QuestionService,
    public helperService: HelperService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.questionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
      // this.currentQuestion = this.questions[0];
    });

    this.assessmentService.getQuestionsByIds(this.assessmentService.mockQuestionIds);

    // Sets up a question listener to get a new question
    // Gets the question based on the passed in id
    // id is passed through the URL
    this.questionSubscription = this.questionService.getQuestionUpdatedListener()
    .subscribe((question: Question) => {
      this.currentQuestion = question;
    });
    this.questionService.getQuestionById(this.route.snapshot.params.questionId);
  }

}
