import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Checkbox } from 'src/app/models/question-types/checkbox.model';
import { Option } from '../../../../models/shared/option.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'app-create-checkbox',
  templateUrl: './create-checkbox.component.html',
  styleUrls: ['./create-checkbox.component.css']
})
export class CreateCheckboxComponent implements OnInit {
  hasAttachments = false;
  createCheckboxForm;
  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private attachmentSerivce: AttachmentService
  ) {
    this.createCheckboxForm = this.formBuilder.group({
      questionText: '',
      hasAttachments: ''
    });
  }

  ngOnInit(): void {
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(checkboxData) {
    const checkboxQuestion: Checkbox = new Checkbox({
      id: null,
      questionId: null,
      questionText: checkboxData.questionText,
      options: this.questionService.getOptions,
      hasAttachments: this.hasAttachments,
      attachments: this.hasAttachments ? this.attachmentSerivce.getAttachments() : null,
      isAnswered: false,
      answers: null,
      duration: 0
    });

    // Resets the form values.
    this.createCheckboxForm.reset();

    // Adds option to the options array in the service.
    this.questionService.saveQuestion(checkboxQuestion);

    // For testing, we can remove later.
    console.log(checkboxQuestion);
  }

  hasAttachmentsChanged() {
    this.hasAttachments = !this.hasAttachments;
  }
}
