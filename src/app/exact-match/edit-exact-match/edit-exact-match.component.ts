import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { ValidationService } from 'src/app/services/validation.service';
import { ExactMatch } from 'src/app/models/shared/exact-match.model';

@Component({
  selector: 'app-edit-exact-match',
  templateUrl: './edit-exact-match.component.html',
  styleUrls: ['./edit-exact-match.component.css']
})
export class EditExactMatchComponent implements OnInit {
  // The match to be edited
  @Input() exactMatch: ExactMatch;
  // The form used to pass the exact match data to update the match
  editExactMatchForm;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService
  ) {
    this.editExactMatchForm = this.formBuilder.group({
      matchText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
  }

  ngOnInit() {
    this.editExactMatchForm.setValue({ matchText: String(this.exactMatch.matchText) });
  }

  // Id is null at this point because it is generated on the backend.
  onSubmit(formData) {

    // This sets validation of the current exact match in the question service
    if (!this.editExactMatchForm.valid) {
      this.questionService.setEditExactMatchInvalid();
      (Object as any).values(this.editExactMatchForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      this.questionService.setEditExactMatchIsValid();
    }

    // Initializes the exact match to be updated
    const updatedMatch = new ExactMatch();

    // If the current exact match to edit is valid
    if (this.questionService.exactMatchIsValid) {
      updatedMatch._id = this.exactMatch._id;
      updatedMatch.questionId = this.exactMatch.questionId;
      updatedMatch.matchText = formData.matchText;

      // Adds current exact match to the matches array in the service.
      this.questionService.updateMatch(this.exactMatch, updatedMatch);

      // For testing, we can remove later.
      console.log(updatedMatch);
    }
  }
}
