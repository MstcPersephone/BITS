import { Component, OnInit, Input } from '@angular/core';
import { Question } from 'src/app/models/question.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { MultipleChoice } from 'src/app/models/question-types/multiple-choice.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-edit-multiple-choice',
  templateUrl: './edit-multiple-choice.component.html',
  styleUrls: ['./edit-multiple-choice.component.css']
})
export class EditMultipleChoiceComponent implements OnInit {
  @Input() question: Question;
  isValid; // stores the validation set in the question service
  showCancelButton = false;
  editMultipleChoiceForm;
  constructor(
    public questionService: QuestionService,
    private formBuilder: FormBuilder,
    public attachmentService: AttachmentService
  ) {
    this.editMultipleChoiceForm = this.formBuilder.group({
      questionText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]],
      hasAttachments: ''
    });
  }

  ngOnInit(): void {
    // console.log(this.question);
    this.editMultipleChoiceForm.get('questionText').setValue(this.question.questionText);
    // Pass the attachments off to the attachment service to be managed.
    if (this.question.hasAttachments) {
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
      this.attachmentService.hasAttachmentFileNames = true;
    } else {
      this.attachmentService.attachments = [];
    }
    this.questionService.showCreateOption = false;
  }

  clickAdd() {
    // If the child form is loaded, calls validation on the child form when add button is clicked
    if (this.questionService.showCreateOption) {
      document.getElementById('validateOption').click();
      this.isValid = this.questionService.optionIsValid;
    }
    // sets the form to remain as visible
    this.questionService.showCreateOption = true;
    // sets the cancel button to visible
    this.showCancelButton = true;
  }

  clickCancel() {
    // Hides the form and the cancel button
    // restores previous validity on the option to allow saving on submit
    const options = this.questionService.getOptions();
    if (options.length > 0) {
      this.questionService.showCreateOption = false;
    }
    this.showCancelButton = false;
    this.questionService.showCreateOption = false;
    this.questionService.optionIsValid = this.isValid;
  }

  onSubmit(formData) {
    // Initializes the updated Mutiple Choice question to be saved
    const updatedMultipleChoiceQuestion: MultipleChoice = new MultipleChoice();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleEditQuestionFormValidation(updatedMultipleChoiceQuestion);

    // If the child form is loaded, calls validation on the child form when submit button is clicked
    if (this.questionService.showCreateOption) {
      document.getElementById('validateOption').click();
    }

    const options = this.questionService.getOptions();
    options.forEach(option => {
      document.getElementById('validateEditOptions').click();
    });

    console.log('Points are valid', this.questionService.pointsIsValid);
    console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    console.log('Sort Answer form is valid', this.editMultipleChoiceForm.valid);
    console.log('Option form is valid', this.questionService.optionIsValid);

    // Calls validation on the current form when submit button is clicked
    if (!this.editMultipleChoiceForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.editMultipleChoiceForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.editMultipleChoiceForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid && this.questionService.optionIsValid) {
      updatedMultipleChoiceQuestion._id = this.question._id;
      updatedMultipleChoiceQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
      updatedMultipleChoiceQuestion.options = this.questionService.getOptions();
      updatedMultipleChoiceQuestion.hasAttachments = this.attachmentService.hasAttachments;
      updatedMultipleChoiceQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
      updatedMultipleChoiceQuestion.isAnswered = false;
      updatedMultipleChoiceQuestion.duration = 0;
      updatedMultipleChoiceQuestion.assessmentIds = null;

      // Resets both current form and cancel button to not visible
      this.questionService.showCreateOption = false;
      this.showCancelButton = false;

      // Sends the data to the quesiton service to handle passing data for updating in database
      this.questionService.updateQuestionById(updatedMultipleChoiceQuestion);

      // For testing, we can remove later.
      console.log('Question to save', updatedMultipleChoiceQuestion);
    }
  }

}
