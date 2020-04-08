import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Checkbox } from 'src/app/models/question-types/checkbox.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-create-checkbox',
  templateUrl: './create-checkbox.component.html',
  styleUrls: ['./create-checkbox.component.css']
})
export class CreateCheckboxComponent implements OnInit {
  createCheckboxForm;
  showCancelButton = false;

  constructor(
    public attachmentService: AttachmentService,
    private formBuilder: FormBuilder,
    public questionService: QuestionService
  ) {
    this.createCheckboxForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: ''
    });
  }

  ngOnInit(): void {
    // Clear the attachments on init for when the form reloads
    this.attachmentService.resetAttachments();
    this.questionService.showCreateOption = true;
    this.questionService.options = [];
  }

  clickAdd() {
    // // If the child form is loaded, calls validation on the child form when add button is clicked
    // if (this.questionService.showCreateMatch) {
    //   document.getElementById('validateExactMatches').click();
    //   this.isValid = this.questionService.exactMatchIsValid;
    // }
    // // sets the form to remain as visible
    this.questionService.showCreateMatch = true;
    // // sets the cancel button to visible
    this.showCancelButton = true;
  }

  clickCancel() {
    // Hides the form and the cancel button
    // restores previous validity on the exact match to allow saving on submit
    // const matches = this.questionService.getMatches();
    // if (matches.length > 0) {
    //   this.questionService.showCreateMatch = false;
    // }
    this.showCancelButton = false;
    // this.questionService.exactMatchIsValid = this.isValid;
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(checkboxData) {
    // Initializes a new Checkbox question to be saved
    const checkboxQuestion: Checkbox = new Checkbox();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleCreateQuestionFormValidation(checkboxQuestion);

    // If the child form is loaded, calls validation on the child form when submit button is clicked
    // if (this.questionService.showCreateMatch) {
    //   document.getElementById('validateCBOption').click();
    // }

    console.log('Points are valid', this.questionService.pointsIsValid);
    console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    console.log('Sort Answer form is valid', this.createCheckboxForm.valid);
    console.log('Option form is valid', this.questionService.optionIsValid);

    // Calls validation on the current form when submit button is clicked
    if (!this.createCheckboxForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.createCheckboxForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.createCheckboxForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid) {
      checkboxQuestion._id = null;
      checkboxQuestion.questionText = checkboxData.questionText;
      checkboxQuestion.options = this.questionService.getOptions();
      checkboxQuestion.hasAttachments = this.attachmentService.hasAttachments;
      checkboxQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : null;
      checkboxQuestion.isAnswered = false;
      checkboxQuestion.answers = null;
      checkboxQuestion.duration = 0;
      checkboxQuestion.assessmentIds = null;

      // Sends the data to the quesiton service to handle passing data for saving in database
      // this.questionService.saveQuestion(checkboxQuestion);

      // For testing, we can remove later.
      console.log(checkboxQuestion);
    }
  }
}
