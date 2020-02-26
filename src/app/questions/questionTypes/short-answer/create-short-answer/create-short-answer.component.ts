import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShortAnswer } from 'src/app/models/question-types/short-answer.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'app-create-short-answer',
  templateUrl: './create-short-answer.component.html',
  styleUrls: ['./create-short-answer.component.css']
})
export class CreateShortAnswerComponent implements OnInit {
// The form object
  createShortAnswerForm;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    public attachmentService: AttachmentService
              ) {
    this.createShortAnswerForm = this.formBuilder.group({
      questionText: '',
      questionAnswer: '',
      hasAttachments: ''
    });
     }

  ngOnInit(): void {
  }

    // Id is null at this point because it is generated on the backend.
    onSubmit(questionData) {
      const shortAnswerQuestion: ShortAnswer =  new ShortAnswer();
      shortAnswerQuestion.id = null;
      shortAnswerQuestion.questionText = questionData.questionText;
      shortAnswerQuestion.hasAttachments = this.attachmentService.hasAttachments;
      shortAnswerQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
      shortAnswerQuestion.isAnswered = false;
      shortAnswerQuestion.matches = this.questionService.getMatches();
      shortAnswerQuestion.duration = 0;

      // Resets the form values.
      this.createShortAnswerForm.reset();

      // Adds option to the options array in the service.
      this.questionService.saveQuestion(shortAnswerQuestion);

      this.questionService.clearMatches();

      // For testing, we can remove later.
      console.log({shortAnswerQuestion});
    }
}
