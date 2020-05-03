import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TrueFalse } from 'src/app/models/question-types/true-false.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';
import { ValidationService } from 'src/app/services/validation.service';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Question } from 'src/app/models/question.interface';


@Component({
  selector: 'app-create-true-false',
  templateUrl: './create-true-false.component.html',
  styleUrls: ['./create-true-false.component.css']
})
export class CreateTrueFalseComponent implements OnInit, OnDestroy {
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

  onSubmit(trueFalseData) {

    // Initializes a new True False question to be saved
    const trueFalseQuestion: TrueFalse = new TrueFalse();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleCreateQuestionFormValidation(trueFalseQuestion);

    // console.log('Points are valid', this.questionService.pointsIsValid);
    // console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    // console.log('True False From is valid', this.createTrueFalseForm.valid);

    // Calls validation on the current form when submit button is clicked
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
      trueFalseQuestion.studentAnswer = null;
      trueFalseQuestion.duration = 0;
      trueFalseQuestion.assessmentIds = null;

      // Do a final check on attachments to make sure they exist and are valid files
      const attachmentResponse = ValidationService.validateAttachments(trueFalseQuestion as Question);

      if (attachmentResponse.result) {
        // Sends the data to the quesiton service to handle passing data for saving in database
        this.questionService.saveQuestion(trueFalseQuestion);
      } else {
        this.helperService.openSnackBar(attachmentResponse.message, 'OK', 'error-dialog', undefined);
      }

      // For testing, we can remove later.
      // console.log('Question to save', trueFalseQuestion);
    }
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
  }
}
