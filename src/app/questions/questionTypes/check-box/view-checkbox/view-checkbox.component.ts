import { Component, OnInit, Input } from '@angular/core';
import { Checkbox } from 'src/app/models/question-types/checkbox.model';
import { FormBuilder } from '@angular/forms';
import { AssessmentService } from 'src/app/services/assessment.service';
import { AssessmentEngineService } from 'src/app/services/assessment-engine.service';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'app-view-checkbox',
  templateUrl: './view-checkbox.component.html',
  styleUrls: ['./view-checkbox.component.css']
})
export class ViewCheckboxComponent implements OnInit {
  answerForm;
  @Input() question: Checkbox;
  constructor(
    public assessmentService: AssessmentService,
    private assessmentEngineService: AssessmentEngineService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService
  ) {
    // Although there are no fields,
    // We still want to create the form and use angular forms
    // to handle the submit function
    this.answerForm = this.formBuilder.group({});

  }

  ngOnInit(): void {
  }

  onChangeOption($event, i) {
    this.question.options[i].optionIsSelected = $event.checked;
    console.log(this.question.options);
  }

  onSubmit() {
    this.assessmentEngineService.checkAnswer(this.question);
  }
}
