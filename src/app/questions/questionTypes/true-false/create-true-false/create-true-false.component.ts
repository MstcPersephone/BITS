import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TrueFalse } from 'src/app/models/question-types/true-false.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuestionType } from 'src/app/enums/questionType.enum';


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
      answer: false
    });
  }

  radioChangeHandler(event: any) {
    this.selectedAnswer = event.value;
  }

  ngOnInit(): void {
  }

  onSubmit(trueFalseData) {
    const trueFalseQuestion: TrueFalse = new TrueFalse();

    trueFalseQuestion.id = null;
    trueFalseQuestion.questionText = trueFalseData.questionText;
    trueFalseQuestion.hasAttachments = this.hasAttachments;
    trueFalseQuestion.attachments = this.hasAttachments ? this.attachmentSerivce.getAttachments() : null;
    trueFalseQuestion.isAnswered = false;
    trueFalseQuestion.answer = this.helperService.convertToTrueFalse(trueFalseData.answer);
    trueFalseQuestion.duration = 0;

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
