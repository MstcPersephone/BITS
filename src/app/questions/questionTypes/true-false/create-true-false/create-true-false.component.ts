import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { TrueFalse } from 'src/app/models/question-types/true-false.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';
import { ValidationService } from 'src/app/services/validation.service';
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
    public questionService: QuestionService,
    public attachmentService: AttachmentService,
    private helperService: HelperService
  ) {
    this.createTrueFalseForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      answer: ['', [Validators.required]]
    });
  }

  radioChangeHandler(event: any) {
    this.selectedAnswer = event.value;
  }

  ngOnInit(): void {
    // Clear the attachments on init for when the form reloads
    this.attachmentService.resetAttachments();
  }

  validateAllFormFields(formGroup: FormBuilder) {
    Object.keys(formGroup.control).forEach(field => {
      const control = formGroup.control;
      if (control instanceof FormControl) {
        control.markAllAsTouched();
      } else if (control instanceof FormBuilder) {
        this.validateAllFormFields(control);
      }
    });
  }


  onSubmit(trueFalseData) {
    if (this.createTrueFalseForm.valid) {
      const trueFalseQuestion: TrueFalse = new TrueFalse();

      trueFalseQuestion._id = null;
      trueFalseQuestion.questionText = trueFalseData.questionText;
      trueFalseQuestion.hasAttachments = this.attachmentService.hasAttachments;
      trueFalseQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
      trueFalseQuestion.isAnswered = false;
      trueFalseQuestion.answer = this.helperService.convertToTrueFalse(trueFalseData.answer);
      trueFalseQuestion.duration = 0;
      trueFalseQuestion.assessmentIds = null;

      // Adds option to the options array in the service.
      this.questionService.saveQuestion(trueFalseQuestion);

    } else {
      (Object as any).values(this.createTrueFalseForm.controls).forEach(control => {
        control.markAsTouched();
      });

    }
  }
}
