import { Component, OnInit } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MultipleChoice } from 'src/app/models/question-types/multiple-choice.model';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-create-multiple-choice',
  templateUrl: './create-multiple-choice.component.html',
  styleUrls: ['./create-multiple-choice.component.css']
})
export class CreateMultipleChoiceComponent implements OnInit {
  createMultipleChoiceForm;

  constructor(
    public attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    private questionService: QuestionService
  ) {
    this.createMultipleChoiceForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: ''
    });
   }

  ngOnInit(): void {
    // Clear the attachments on init for when the form reloads
    this.attachmentService.resetAttachments();
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(multipleChoiceData) {
    const multipleChoiceQuestion: MultipleChoice = new MultipleChoice();
    multipleChoiceQuestion._id =  null;
    multipleChoiceQuestion.questionText = multipleChoiceData.questionText;
    multipleChoiceQuestion.options = this.questionService.getOptions();
    multipleChoiceQuestion.hasAttachments = this.attachmentService.hasAttachments;
    multipleChoiceQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
    multipleChoiceQuestion.isAnswered = false;
    multipleChoiceQuestion.duration = 0;
    multipleChoiceQuestion.assessmentIds = null;

    // Adds option to the options array in the service.
    this.questionService.saveQuestion(multipleChoiceQuestion);

    // For testing, we can remove later.
    console.log(multipleChoiceQuestion);
  }
}
