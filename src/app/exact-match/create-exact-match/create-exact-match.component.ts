import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from 'src/app/services/validation.service';
import { ExactMatch } from 'src/app/models/shared/exact-match.model';

@Component({
  selector: 'app-create-exact-match',
  templateUrl: './create-exact-match.component.html',
  styleUrls: ['./create-exact-match.component.css']
})
export class CreateExactMatchComponent implements OnInit {
  // whether or not the user is editing a question
  @Input() isEditMode: boolean;
  // The form object
  createExactMatchForm;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService) {
    // Creates an object to hold form values.
    this.createExactMatchForm = this.formBuilder.group({
      matchText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
  }

  ngOnInit() {
  }

 // Id is null at this point because it is generated on the backend.
  onSubmit(exactMatchData) {
    // This sets validation of the current exact match in the question service
    if (!this.createExactMatchForm.valid) {
      this.questionService.setExactMatchInvalid();
      (Object as any).values(this.createExactMatchForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      this.questionService.setExactMatchIsValid();
    }

    // Initializes a new exact match
    const exactMatch: ExactMatch = new ExactMatch();

    // If the new exact match to create is valid
    if (this.questionService.exactMatchIsValid) {
      exactMatch._id = null;
      exactMatch.questionId = null;
      exactMatch.matchText = exactMatchData.matchText;

      // Adds exact match to the exact match array in the service.
      this.questionService.createExactMatch(exactMatch);

      // For testing, we can remove later.
      console.log(exactMatch);

      // Resets the form values.
      this.createExactMatchForm.reset();
    }
  }
}
