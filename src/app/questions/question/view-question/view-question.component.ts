import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/services/assessment.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements OnInit {
  questions: Question[];
  currentQuestion: Question;
  questionTypes = [];
  private questionsSubscription: Subscription;
  constructor(
    private assessmentService: AssessmentService
  ) { }

  ngOnInit(): void {
    this.questionsSubscription = this.assessmentService.getAssessmentQuestionsUpdatedListener()
    .subscribe((questionsArray: Question[]) => {
      this.questions = questionsArray;
      this.currentQuestion = this.questions[0];
    });

    this.assessmentService.getQuestionsByIds(this.assessmentService.mockQuestionIds);
  }

}
