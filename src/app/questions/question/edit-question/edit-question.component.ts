import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  question: Question;
  questionSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
    ) { }

  ngOnInit(): void {
    this.questionSubscription = this.questionService.getQuestionUpdatedListener()
    .subscribe((question: Question) => {
      this.question = question;
    });
    this.questionService.getQuestionById(this.route.snapshot.params.questionId);
  }

}
