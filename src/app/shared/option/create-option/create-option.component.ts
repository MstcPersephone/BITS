import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Option } from '../../../models/shared/option.model';
import { QuestionService } from 'src/app/services/question.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-option',
  templateUrl: './create-option.component.html',
  styleUrls: ['./create-option.component.css']
})
export class CreateOptionComponent implements OnInit {
  // Form object.
  createOptionForm;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService
  ) {
    // Creates an object to hold form values.
    this.createOptionForm = this.formBuilder.group({
      optionText: '',
      isAnswer: false
    });
  }

  ngOnInit() {
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(optionData) {
    const option: Option = new Option();
    option._id = null;
    option.questionId = null;
    option.optionText =  optionData.optionText;
    option.isAnswer = optionData.isAnswer;
    option.optionIsSelected = false;

    // Adds option to the options array in the service.
    this.questionService.createOption(option);

    // For testing, we can remove later.
    console.log(option);

    // Resets the form values.
    this.createOptionForm.reset();

    // Recreate the formBuilder for another option to be added.
    this.createOptionForm = this.formBuilder.group({
      optionText: '',
      isAnswer: false
    });
  }
}
