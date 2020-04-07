import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { MultipleChoice } from 'src/app/models/question-types/multiple-choice.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-edit-multiple-choice',
  templateUrl: './edit-multiple-choice.component.html',
  styleUrls: ['./edit-multiple-choice.component.css']
})
export class EditMultipleChoiceComponent implements OnInit {
@Input() question: Question;
editMultipleChoiceForm;
  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService
  ) {
    this.editMultipleChoiceForm = this.formBuilder.group({
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
    const updatedMultipleChoiceQuestion: MultipleChoice = new MultipleChoice();
    console.log(formData);
    updatedMultipleChoiceQuestion._id = this.question._id;
    updatedMultipleChoiceQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
    updatedMultipleChoiceQuestion.options = this.questionService.getOptions();
    updatedMultipleChoiceQuestion.hasAttachments = this.attachmentService.hasAttachments;
    updatedMultipleChoiceQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
    updatedMultipleChoiceQuestion.isAnswered = false;
    updatedMultipleChoiceQuestion.duration = 0;
    updatedMultipleChoiceQuestion.assessmentIds = null;

    this.questionService.updateQuestionById(updatedMultipleChoiceQuestion);
    console.log(formData);
  }

}
