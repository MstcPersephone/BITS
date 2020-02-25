import { Component, OnInit } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';
import { FormBuilder } from '@angular/forms';
import { MultipleChoice } from 'src/app/models/question-types/multiple-choice.model';
import { QuestionService } from 'src/app/services/question.service';

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
      questionText: '',
      hasAttachments: ''
    });
   }

  ngOnInit(): void {
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(multipleChoiceData) {
    const multipleChoiceQuestion: MultipleChoice = new MultipleChoice();
    multipleChoiceQuestion.id =  null;
    multipleChoiceQuestion.questionText = multipleChoiceData.questionText;
    multipleChoiceQuestion.options = this.questionService.getOptions();
    multipleChoiceQuestion.hasAttachments = this.attachmentService.hasAttachments;
    multipleChoiceQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
    multipleChoiceQuestion.isAnswered = false;
    multipleChoiceQuestion.duration = 0;

    // Resets the form values.
    this.createMultipleChoiceForm.reset();

    // Adds option to the options array in the service.
    this.questionService.saveQuestion(multipleChoiceQuestion);

    this.questionService.clearOptions();

    // For testing, we can remove later.
    console.log(multipleChoiceQuestion);
  }

}
