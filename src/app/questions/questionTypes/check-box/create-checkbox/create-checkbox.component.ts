import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Checkbox } from 'src/app/models/question-types/checkbox.model';
import { QuestionType } from '../../../../enums/questionType.enum';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'app-create-checkbox',
  templateUrl: './create-checkbox.component.html',
  styleUrls: ['./create-checkbox.component.css']
})
export class CreateCheckboxComponent implements OnInit {
  createCheckboxForm;
  constructor(
    public attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    private questionService: QuestionService
  ) {
    this.createCheckboxForm = this.formBuilder.group({
      questionText: '',
      hasAttachments: ''
    });
  }

  ngOnInit(): void {
    this.questionService.resetFunction(this.resetForm.bind(this));
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(checkboxData) {
    const checkboxQuestion: Checkbox = new Checkbox();
    checkboxQuestion._id =  null;
    checkboxQuestion.questionText = checkboxData.questionText;
    checkboxQuestion.options = this.questionService.getOptions();
    checkboxQuestion.hasAttachments = this.attachmentService.hasAttachments;
    checkboxQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
    checkboxQuestion.isAnswered = false;
    checkboxQuestion.answers = null;
    checkboxQuestion.duration = 0;

    // Adds option to the options array in the service.
    this.questionService.saveQuestion(checkboxQuestion);

    // For testing, we can remove later.
    console.log(checkboxQuestion);
  }

  resetForm() {
    this.createCheckboxForm.reset();
  }
}
