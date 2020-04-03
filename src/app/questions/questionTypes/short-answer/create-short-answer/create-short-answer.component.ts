import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ShortAnswer } from 'src/app/models/question-types/short-answer.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-create-short-answer',
  templateUrl: './create-short-answer.component.html',
  styleUrls: ['./create-short-answer.component.css']
})
export class CreateShortAnswerComponent implements OnInit {
  // The form object
  createShortAnswerForm;
  @Input() caseSensitive;
  constructor(
    private formBuilder: FormBuilder,
    public questionService: QuestionService,
    public attachmentService: AttachmentService
  ) {
    this.createShortAnswerForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: '',
      isCaseSensitive: ''
    });
  }

  ngOnInit(): void {
    // Clear the attachments on init for when the form reloads
    this.attachmentService.resetAttachments();
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(questionData) {
    const shortAnswerQuestion: ShortAnswer = new ShortAnswer();

    if (this.createShortAnswerForm.valid) {
       // Calls validation on parent form controls
    this.questionService.handleParentQuestionFormValidation(shortAnswerQuestion);

    shortAnswerQuestion._id = null;
    shortAnswerQuestion.questionText = questionData.questionText;
    shortAnswerQuestion.hasAttachments = this.attachmentService.hasAttachments;
    shortAnswerQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
    shortAnswerQuestion.isAnswered = false;
    shortAnswerQuestion.matches = this.questionService.getMatches();
    shortAnswerQuestion.assessmentIds = null;
    shortAnswerQuestion.isCaseSensitive = this.questionService.isCaseSensitive;
    shortAnswerQuestion.duration = 0;

      // Adds option to the options array in the service.
    // this.questionService.saveQuestion(shortAnswerQuestion);

      // For testing, we can remove later.
    console.log('Question to save', shortAnswerQuestion);

    } else {
      // Runs all validation on the createTrueFalse form controls
      (Object as any).values(this.createShortAnswerForm.controls).forEach(control => {
        control.markAsTouched();
      });

      // Calls validation on parent form controls
      this.questionService.handleParentQuestionFormValidation(shortAnswerQuestion);
    }
  }
}
