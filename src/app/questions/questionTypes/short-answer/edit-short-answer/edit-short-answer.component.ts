import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { ShortAnswer } from 'src/app/models/question-types/short-answer.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ExactMatch } from 'src/app/models/shared/exact-match.model';

@Component({
  selector: 'app-edit-short-answer',
  templateUrl: './edit-short-answer.component.html',
  styleUrls: ['./edit-short-answer.component.css']
})
export class EditShortAnswerComponent implements OnInit {
  @Input() question: Question;
  editShortAnswerForm;

  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService
  ) {
    this.editShortAnswerForm = this.formBuilder.group({
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

  onSubmit(formData) {
    const updatedShortAnswerQuestion: ShortAnswer = new ShortAnswer();
    console.log(formData);
    updatedShortAnswerQuestion._id = this.question._id;
    updatedShortAnswerQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
    updatedShortAnswerQuestion.matches = this.questionService.getMatches();
    updatedShortAnswerQuestion.hasAttachments = this.attachmentService.hasAttachments;
    updatedShortAnswerQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
    updatedShortAnswerQuestion.isAnswered = false;
    updatedShortAnswerQuestion.studentAnswer = null;
    updatedShortAnswerQuestion.duration = 0;

    this.questionService.updateQuestionById(updatedShortAnswerQuestion);
    console.log(formData);
  }
}
