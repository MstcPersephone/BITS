import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { Checkbox } from 'src/app/models/question-types/checkbox.model';
import { AttachmentService } from 'src/app/services/attachment.service';

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
    private attachmentService: AttachmentService
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
    const updatedCheckboxQuestion: Checkbox = new Checkbox();

    updatedCheckboxQuestion._id = this.question._id;
    updatedCheckboxQuestion.questionText = formData.questionText;
    updatedCheckboxQuestion.options = this.questionService.getOptions();
    updatedCheckboxQuestion.hasAttachments = this.attachmentService.hasAttachments;
    updatedCheckboxQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
    updatedCheckboxQuestion.isAnswered = false;
    updatedCheckboxQuestion.answers = null;
    updatedCheckboxQuestion.duration = 0;

    this.questionService.updateQuestionById(updatedCheckboxQuestion);
    console.log(formData);
  }
}
