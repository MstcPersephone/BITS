import { Component, OnInit, Input } from '@angular/core';
import { MultipleChoice } from 'src/app/models/question-types/multiple-choice.model';
import { FormBuilder } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AssessmentEngineService } from 'src/app/services/assessment-engine.service';

@Component({
  selector: 'app-view-multiple-choice',
  templateUrl: './view-multiple-choice.component.html',
  styleUrls: ['./view-multiple-choice.component.css']
})
export class ViewMultipleChoiceComponent implements OnInit {
  answerForm;
  @Input() question: MultipleChoice;

  constructor(
    public assessmentService: AssessmentService,
    private assessmentEngineService: AssessmentEngineService,
    private formBuilder: FormBuilder
  ) {
    // Although there are no fields,
    // We still want to create the form and use angular forms
    // to handle the submit function
    this.answerForm = this.formBuilder.group({});
   }

  ngOnInit(): void {
  }

  onChangeOption($event, i) {
    this.question.options.forEach(element => {
      element.optionIsSelected = false;
    });
    this.question.options[i].optionIsSelected = true;
    console.log(this.question.options);
  }

  onSubmit() {
    this.assessmentEngineService.checkAnswer(this.question);
  }
}
