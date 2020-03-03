import { Component, OnInit, Input } from '@angular/core';
import { MultipleChoice } from 'src/app/models/question-types/multiple-choice.model';
import { FormBuilder } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-view-multiple-choice',
  templateUrl: './view-multiple-choice.component.html',
  styleUrls: ['./view-multiple-choice.component.css']
})
export class ViewMultipleChoiceComponent implements OnInit {
  answerMultipleChoiceForm;
  @Input() question: MultipleChoice;

  constructor(
    private assessmentService: AssessmentService,
    private formBuilder: FormBuilder
  ) {
    // Although there are no fields,
    // We still want to create the form and use angular forms
    // to handle the submit function
    this.answerMultipleChoiceForm = this.formBuilder.group({});
   }

  ngOnInit(): void {
  }

  onChangeOption($event, i) {
    this.question.options[i].optionIsSelected = $event.checked;
    console.log(this.question.options);
  }

  onSubmit() {
    this.assessmentService.submitAnswer(this.question);
  }
}
