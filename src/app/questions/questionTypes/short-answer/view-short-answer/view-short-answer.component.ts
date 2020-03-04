import { Component, OnInit, Input } from '@angular/core';
import { ShortAnswer } from 'src/app/models/question-types/short-answer.model';
import { FormBuilder } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';

@Component({
  selector: 'app-view-short-answer',
  templateUrl: './view-short-answer.component.html',
  styleUrls: ['./view-short-answer.component.css']
})
export class ViewShortAnswerComponent implements OnInit {
answerShortAnswerForm;
@Input() question: ShortAnswer;

  constructor(
    private assessmentService: AssessmentService,
    private formBuilder: FormBuilder
  ) {
    // Although there are no fields,
    // We still want to create the form and use angular forms
    // to handle the submit function
    this.answerShortAnswerForm = this.formBuilder.group({});
   }

  ngOnInit(): void {
  }

  onSubmit() {
    this.assessmentService.submitAnswer(this.question);
  }
}
