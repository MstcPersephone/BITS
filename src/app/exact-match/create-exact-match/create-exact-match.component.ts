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
      matchText: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  onSubmit(exactMatchData) {
    const exactMatch: ExactMatch = new ExactMatch();
    const matches = this.questionService.getMatches();

    if (exactMatchData.matchText !== null && matches.length > 0) {}

    if (this.createExactMatchForm.valid) {

      exactMatch._id = null;
      exactMatch.questionId = null;
      exactMatch.matchText = exactMatchData.matchText;

      // Adds option to the options array in the service.
      this.questionService.createExactMatch(exactMatch);

      // Resets the form values.
      this.createExactMatchForm.reset();

      // For testing, we can remove later.
      console.log(exactMatch);
    } else {
      if (matches.length < 1) {
        // Runs all validation on the createExactMatchForm controls
        (Object as any).values(this.createExactMatchForm.controls).forEach(control => {
          control.markAsTouched();
        });
      }
    }
  }
}
