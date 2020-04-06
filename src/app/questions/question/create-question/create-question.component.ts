import { Component, OnInit, ViewChild } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { ValidationService } from '../../../services/validation.service';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {
  questionSelectionFormGroup;
  addPointForm;
  pointSubscription: Subscription;
  questionTypes = [];
  questionTypeSelected: string;
  points: number;

  constructor(public questionService: QuestionService,
              private formBuilder: FormBuilder,
              public helperService: HelperService) {
    // Creates an object to hold form values.
    this.addPointForm = this.formBuilder.group({
      points: ['', [Validators.required, ValidationService.pointsValidator]]
    });
  }

  ngOnInit(): void {
    // gets the question types from the QuestionType enum
    this.questionTypes = this.helperService.getQuestionTypes();

    // Sets up a points listener
    this.pointSubscription = this.questionService.getPointsUpdatedListener()
    .subscribe((points: number) => {
      console.log(points);
      this.points = points;
    });
  }

  // Sets the variable for the ngSwitch statement in html file
  // Function is triggered after user selects an option
  onQuestionTypeSelected(event) {
    this.questionTypeSelected = event.value;
    console.log(this.questionTypeSelected + ' Question Selected');
  }

  // This is a button click simulation to help with validation when saving question
  onSubmit(pointsData) {
    if (!this.addPointForm.valid) {
      this.questionService.setPointsInvalid();
      (Object as any).values(this.addPointForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      this.questionService.setPointsIsValid();
    }
  }

}
