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

  // validateAllFormFields(formGroup: FormBuilder) {
  //   Object.keys(formGroup.control).forEach(field => {
  //     const control = formGroup.control;
  //     if (control instanceof FormControl) {
  //       control.markAllAsTouched();
  //     } else if (control instanceof FormBuilder) {
  //       this.validateAllFormFields(control);
  //     }
  //   });
  // }


  onSubmit(trueFalseData) {

    // Initializes a new True False question to be saved
    const trueFalseQuestion: TrueFalse = new TrueFalse();

    // Calls validation on parent form controls
    // If the parent forms are invalid, submit is not allowed
    // Marks all input as touched to show errors so user knows what requires valid input
    this.questionService.handleParentQuestionFormValidation(trueFalseQuestion);
    // console.log('Points are valid', this.questionService.pointsIsValid);
    // console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    // console.log('True False From is valid', this.createTrueFalseForm.valid);

    // If the createTrueFalseForm is invalid, submit is not allowed
    // Marks all input as touched to show errors so user knows what requires valid input
    if (!this.createTrueFalseForm.valid) {
      // Runs all validation on the createTrueFalse form controls
      (Object as any).values(this.createTrueFalseForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.createTrueFalseForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid) {
      trueFalseQuestion._id = null;
      trueFalseQuestion.questionText = trueFalseData.questionText;
      trueFalseQuestion.hasAttachments = this.attachmentService.hasAttachments;
      trueFalseQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
      trueFalseQuestion.isAnswered = false;
      trueFalseQuestion.answer = this.helperService.convertToTrueFalse(trueFalseData.answer);
      trueFalseQuestion.duration = 0;
      trueFalseQuestion.assessmentIds = null;

      // Sends the data to the quesiton service to handle passing data for saving in database
      this.questionService.saveQuestion(trueFalseQuestion);

      // For testing, we can remove later.
      // console.log('Question to save', trueFalseQuestion);
    }
  }
}
