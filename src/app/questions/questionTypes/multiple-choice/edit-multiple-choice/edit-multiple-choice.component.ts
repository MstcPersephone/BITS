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
    console.log(this.question);
    // Pass the attachments off to the attachment service to be managed.
    if (this.question.hasAttachments) {
      this.attachmentService.attachments = this.question.attachments;
      this.attachmentService.hasAttachments = true;
      this.attachmentService.hasAttachmentFileNames = true;
    } else {
      this.attachmentService.attachments = [];
    }
  }

  onSubmit(formData) {
    // Initializes the updated Mutiple Choice question to be saved
    const updatedMultipleChoiceQuestion: MultipleChoice = new MultipleChoice();

    // Calls validation on parent form controls when submit button is clicked
    this.questionService.handleEditQuestionFormValidation(updatedMultipleChoiceQuestion);

    // If the child form is loaded, calls validation on the child form when submit button is clicked
    // if (this.questionService.showCreateMatch) {
    //   document.getElementById('validateExactMatches').click();
    // }

    // const matches = this.questionService.getMatches();
    // matches.forEach(match => {
    //   document.getElementById('validateEditMatches').click();
    // });

    console.log('Points are valid', this.questionService.pointsIsValid);
    console.log('Categoriess are valid', this.questionService.categoriesIsValid);
    console.log('Sort Answer form is valid', this.editMultipleChoiceForm.valid);
    // console.log('Exact Match form is valid', this.questionService.exactMatchIsValid);

    // Calls validation on the current form when submit button is clicked
    if (!this.editMultipleChoiceForm.valid) {
      // Runs all validation on the createShortAnswerForm form controls
      (Object as any).values(this.editMultipleChoiceForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // If all input of parent and child forms is valid, data will be passed to question service for saving
    if (this.editMultipleChoiceForm.valid && this.questionService.pointsIsValid
      && this.questionService.categoriesIsValid) {
      updatedMultipleChoiceQuestion._id = this.question._id;
      updatedMultipleChoiceQuestion.questionText = formData.questionText === '' ? this.question.questionText : formData.questionText;
      updatedMultipleChoiceQuestion.options = this.questionService.getOptions();
      updatedMultipleChoiceQuestion.hasAttachments = this.attachmentService.hasAttachments;
      updatedMultipleChoiceQuestion.attachments = this.attachmentService.hasAttachments ? this.attachmentService.getAttachments() : [];
      updatedMultipleChoiceQuestion.isAnswered = false;
      updatedMultipleChoiceQuestion.duration = 0;
      updatedMultipleChoiceQuestion.assessmentIds = null;

      // Sends the data to the quesiton service to handle passing data for updating in database
      this.questionService.updateQuestionById(updatedMultipleChoiceQuestion);

      // For testing, we can remove later.
      console.log('Question to save', updatedMultipleChoiceQuestion);
    }
  }

}
