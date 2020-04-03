import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { Checkbox } from 'src/app/models/question-types/checkbox.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';


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
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService
  ) {
    this.editCheckboxForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: ''
    });
   }

  ngOnInit(): void {
    console.log(this.question);
    // Pass the attachments off to the attachment service to be managed.
    if (this.question.hasAttachments) {
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
      this.attachmentService.hasAttachmentFileNames = true;
    } else {
      this.attachmentService.attachments = [];
    }
  }

  onSubmit(formData) {
    const updatedCheckboxQuestion: Checkbox = new Checkbox();
    console.log(formData);
    updatedCheckboxQuestion._id = this.question._id;
    updatedCheckboxQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
    updatedCheckboxQuestion.options = this.questionService.getOptions();
    updatedCheckboxQuestion.hasAttachments = this.attachmentService.hasAttachments;
    updatedCheckboxQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
    updatedCheckboxQuestion.isAnswered = false;
    updatedCheckboxQuestion.answers = null;
    updatedCheckboxQuestion.duration = 0;
    updatedCheckboxQuestion.assessmentIds = null;

    this.questionService.updateQuestionById(updatedCheckboxQuestion);
    console.log(formData);
  }
}
