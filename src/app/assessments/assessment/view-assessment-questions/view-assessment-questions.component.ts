import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from '../../../models/question.interface';


@Component({
  selector: 'app-view-assessment-questions',
  templateUrl: './view-assessment-questions.component.html',
  styleUrls: ['./view-assessment-questions.component.css']
})
export class ViewAssessmentQuestionsComponent implements OnInit {
  public currentQuestion: Question;
  questionSubscription: Subscription;

  constructor(
    public questionService: QuestionService,
    public route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
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

    // A function to allow a user to return to an assessment view after viewing a single question from table
    returnToAssessment() {
      this.location.back();
    }

}
