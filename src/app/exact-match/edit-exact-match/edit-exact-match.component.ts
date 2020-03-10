import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
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
      // Creates an object to hold form values.
      this.editExactMatchForm = this.formBuilder.group({
        matchText: ''
      });
   }

  ngOnInit() {
  }

  // On submit passes the form data to the question service to update the match text
  onSubmit(formData) {
    const updatedMatch = new ExactMatch();
    updatedMatch._id = this.exactMatch._id;
    updatedMatch.questionId = this.exactMatch.questionId;
    updatedMatch.matchText = formData.matchText;

    this.questionService.updateMatch(this.exactMatch, updatedMatch);
    console.log(updatedMatch);
  }
}
