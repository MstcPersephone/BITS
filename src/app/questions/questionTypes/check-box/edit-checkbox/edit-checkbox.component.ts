import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-edit-checkbox',
  templateUrl: './edit-checkbox.component.html',
  styleUrls: ['./edit-checkbox.component.css']
})
export class EditCheckboxComponent implements OnInit {
  @Input() question: Question;
  editCheckboxForm;
  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder
  ) {
    this.editCheckboxForm = this.formBuilder.group({
      questionText: '',
      hasAttachments: ''
    });
   }

  ngOnInit(): void {
    console.log(this.question);
  }

  onSubmit(formData) {
    console.log(formData);
  }
}
