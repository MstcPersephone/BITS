import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Option } from 'src/app/models/shared/option.model';

@Component({
  selector: 'app-edit-option',
  templateUrl: './edit-option.component.html',
  styleUrls: ['./edit-option.component.css']
})
export class EditOptionComponent implements OnInit {
  @Input() option: Option;
  editOptionForm;
  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService
  ) {
    this.editOptionForm = this.formBuilder.group({
      optionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      isAnswer: ''
    });
  }

  ngOnInit() {
    this.editOptionForm.get('optionText').setValue(this.option.optionText);
    this.editOptionForm.get('isAnswer').setValue(this.option.isAnswer);
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(formData) {
    // This sets validation of the current option in the question service
    if (!this.editOptionForm.valid) {
      this.questionService.setOptionInvalid();
      (Object as any).values(this.editOptionForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      this.questionService.setOptionIsValid();
    }

    // Initializes the option to be updated
    const updatedOption = new Option();

    // If the current option to edit is valid
    if (this.questionService.optionIsValid) {
      updatedOption._id = this.option._id;
      updatedOption.questionId = this.option.questionId;
      updatedOption.optionText = formData.optionText;
      updatedOption.isAnswer = formData.isAnswer;
      updatedOption.optionIsSelected = false;

      // Adds current option to the options array in the service.
      this.questionService.updateOption(this.option, updatedOption);

      // For testing, we can remove later.
      console.log(updatedOption);
    }
  }
}
