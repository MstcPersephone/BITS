import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  // editExactMatchFormArray = new FormArray(this.editExactMatchForm);
  matchSubscription: Subscription;
  exactMatches: ExactMatch[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService
  ) {

    // this.editExactMatchFormArray = [this.editExactMatchForm = this.formBuilder.group({
    //   matchText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    // })];
    // Creates an object to hold form values.
    this.editExactMatchForm = this.formBuilder.group({
      matchText: ['', [Validators.required, ValidationService.invalidWhiteSpaceOnly]]
    });
  }

  ngOnInit() {
    this.editExactMatchForm.setValue({ matchText: String(this.exactMatch.matchText) });
  }

  // On submit passes the form data to the question service to update the match text
  onSubmit(formData) {

    if (!this.editExactMatchForm.valid) {
      this.questionService.setExactMatchInvalid();
      (Object as any).values(this.editExactMatchForm.controls).forEach(control => {
        control.markAsTouched();
      });
    } else {
      this.questionService.setExactMatchIsValid();
    }

    const updatedMatch = new ExactMatch();

    if (this.questionService.exactMatchIsValid) {
      updatedMatch._id = this.exactMatch._id;
      updatedMatch.questionId = this.exactMatch.questionId;
      updatedMatch.matchText = formData.matchText;

      this.questionService.updateMatch(this.exactMatch, updatedMatch);
      console.log(updatedMatch);
    }
  }
}
