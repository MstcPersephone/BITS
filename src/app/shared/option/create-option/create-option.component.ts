import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Option } from '../../../models/shared/option.model';
import { Question } from 'src/app/models/question.interface';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-create-option',
  templateUrl: './create-option.component.html',
  styleUrls: ['./create-option.component.css']
})
export class CreateOptionComponent implements OnInit {
  // whether or not the user is editing a question
  @Input() isEditMode: boolean;
  @Input() question: Question;
  // Form object.
  createOptionForm;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService) {
    // Creates an object to hold form values.
    this.createOptionForm = this.formBuilder.group({
      optionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      isAnswer: false
    });
  }

  ngOnInit() {

  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(optionData) {
    // This sets validation of the current option in the question service
    if (!this.createOptionForm.valid) {
      this.questionService.setOptionInvalid();
      (Object as any).values(this.createOptionForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      this.questionService.setOptionIsValid();
    }

    // Initializes a new option
    const option: Option = new Option();

    // If the new option to create is valid
    if (this.questionService.optionIsValid) {
      option._id = null;
      option.questionId = null;
      option.optionText = optionData.optionText;
      if (optionData.isAnswer === null) {
        option.isAnswer = false;
      } else {
        option.isAnswer = optionData.isAnswer;
      }
      option.optionIsSelected = false;

      // Adds current option to the options array in the service.
      this.questionService.createOption(option);

      this.createOptionForm.reset();

      // For testing, we can remove later.
      console.log(option);
    }

  }
}
