import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from '../../../services/validation.service';
import { HelperService } from 'src/app/services/helper.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
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
      points: ['', [Validators.required, ValidationService.pointsValidator]]
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

  // This is a button click simulation to help with validation when saving question
  onSubmit(pointsData) {
    if (!this.editPointForm.valid) {
      (Object as any).values(this.editPointForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

}
