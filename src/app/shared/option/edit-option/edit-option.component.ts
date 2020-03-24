import { Component, OnInit, Input } from '@angular/core';
import { Option } from 'src/app/models/shared/option.model';
import { FormBuilder } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';

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
      optionText: '',
      isAnswer: ''
    });
   }

  ngOnInit() {
    this.editOptionForm.get('isAnswer').setValue(this.option.isAnswer);
  }

  onSubmit(formData) {
    const updatedOption = new Option();
    updatedOption._id = this.option._id;
    updatedOption.questionId = this.option.questionId;
    updatedOption.optionText = formData.optionText;
    updatedOption.isAnswer = formData.isAnswer;
    updatedOption.optionIsSelected = false;
    this.questionService.updateOption(this.option, updatedOption);
    console.log(updatedOption);
  }
}
