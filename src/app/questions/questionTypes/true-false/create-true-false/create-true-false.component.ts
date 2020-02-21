import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TrueFalse } from 'src/app/models/question-types/true-false.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-create-true-false',
  templateUrl: './create-true-false.component.html',
  styleUrls: ['./create-true-false.component.css']
})
export class CreateTrueFalseComponent implements OnInit {
  hasAttachments = false;
  selectedAnswer = '';
  answers: any = [
    'True',
    'False'
  ];
  createTrueFalseForm;
  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private attachmentSerivce: AttachmentService,
    private helperService: HelperService
  ) {
    this.createTrueFalseForm = this.formBuilder.group({
      questionText: '',
      hasAttachments: '',
      answer: false
    });
  }

  radioChangeHandler(event: any) {
    this.selectedAnswer = event.target.value;
  }

  ngOnInit(): void {
  }

  onSubmit(trueFalseData) {
    const trueFalseQuestion: TrueFalse = new TrueFalse({
      id: null,
      questionId: null,
      questionText: trueFalseData.questionText,
      hasAttachments: this.hasAttachments,
      attachments: this.hasAttachments ? this.attachmentSerivce.getAttachments() : null,
      isAnswered: false,
      answer: this.helperService.convertToTrueFalse(trueFalseData.answer),
      duration: 0
    });

    // Resets the form values.
    this.createTrueFalseForm.reset();

    // Adds option to the options array in the service.
    this.questionService.saveQuestion(trueFalseQuestion);

    // For testing, we can remove later.
    console.log(trueFalseQuestion);
  }

  hasAttachmentsChanged() {
    this.hasAttachments = !this.hasAttachments;
  }
}
