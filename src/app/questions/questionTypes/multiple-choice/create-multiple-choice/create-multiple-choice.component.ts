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
    this.questionService.options = [];
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(multipleChoiceData) {
    // Initializes a new Short Answer question to be saved
    const multipleChoiceQuestion: MultipleChoice = new MultipleChoice();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleCreateQuestionFormValidation(multipleChoiceData);

    // If the child form is loaded, calls validation on the child form when submit button is clicked
    // if (this.questionService.showCreateMatch) {
    //   document.getElementById('validateExactMatches').click();
    // }

    console.log('Points are valid', this.questionService.pointsIsValid);
    console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    console.log('Sort Answer form is valid', this.createMultipleChoiceForm.valid);
    // console.log('Exact Match form is valid', this.questionService.exactMatchIsValid);

    // Calls validation on the current form when submit button is clicked
    if (!this.createMultipleChoiceForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.createMultipleChoiceForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.createMultipleChoiceForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid) {
      multipleChoiceQuestion._id = null;
      multipleChoiceQuestion.questionText = multipleChoiceData.questionText;
      multipleChoiceQuestion.options = this.questionService.getOptions();
      multipleChoiceQuestion.hasAttachments = this.attachmentService.hasAttachments;
      multipleChoiceQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
      multipleChoiceQuestion.isAnswered = false;
      multipleChoiceQuestion.duration = 0;
      multipleChoiceQuestion.assessmentIds = null;

      // Sends the data to the quesiton service to handle passing data for saving in database
      // this.questionService.saveQuestion(multipleChoiceQuestion);

      // For testing, we can remove later.
      console.log(multipleChoiceQuestion);
    }
  }
}
