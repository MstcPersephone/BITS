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
  selectedAnswer = '';
  answers: any = [
    'True',
    'False'
  ];
  createTrueFalseForm;
  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    public attachmentService: AttachmentService,
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
    this.attachmentService.resetAttachments();
  }

  onSubmit(trueFalseData) {
    const trueFalseQuestion: TrueFalse = new TrueFalse();

    trueFalseQuestion._id = null;
    trueFalseQuestion.questionText = trueFalseData.questionText;
    trueFalseQuestion.hasAttachments = this.attachmentService.hasAttachments;
    trueFalseQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
    trueFalseQuestion.isAnswered = false;
    trueFalseQuestion.answer = this.helperService.convertToTrueFalse(trueFalseData.answer);
    trueFalseQuestion.duration = 0;

    // For testing, we can remove later.
    console.log(trueFalseQuestion);

    // Adds option to the options array in the service.
    this.questionService.saveQuestion(trueFalseQuestion);

     // Resets the form values.
    this.createTrueFalseForm.reset();
  }

    // Resets the form
    resetForm() {
      this.createTrueFalseForm.reset();
    }
}
