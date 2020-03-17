import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { TrueFalse } from 'src/app/models/question-types/true-false.model';

@Component({
  selector: 'app-edit-true-false',
  templateUrl: './edit-true-false.component.html',
  styleUrls: ['./edit-true-false.component.css']
})
export class EditTrueFalseComponent implements OnInit {
// The question being edited
  @Input() question: Question;
// The true false edit form used to update the quesiton
  editTrueFalseForm;
  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService
  ) {
    this.editTrueFalseForm = this.formBuilder.group({
      questionText: '',
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

}
