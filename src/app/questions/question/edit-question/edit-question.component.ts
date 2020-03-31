import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  isEditMode: boolean;
  question: Question;
  questionSubscription: Subscription;
  editPointForm;

  constructor(
    private route: ActivatedRoute,
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public helperService: HelperService
    ) {
      // Creates an object to hold form values.
    this.editPointForm = this.formBuilder.group({
      points: ''
    });
     }

  ngOnInit(): void {
    // Sets up a question listener to get a new question
    // Gets the question based on the passed in id
    // id is passed through the URL
    this.questionSubscription = this.questionService.getQuestionUpdatedListener()
    .subscribe((question: Question) => {
      this.question = question;
    });
    this.questionService.getQuestionById(this.route.snapshot.params.questionId);
  }

}
