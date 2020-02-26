import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { ExactMatch } from 'src/app/models/shared/exact-match.model';

@Component({
  selector: 'app-create-exact-match',
  templateUrl: './create-exact-match.component.html',
  styleUrls: ['./create-exact-match.component.css']
})
export class CreateExactMatchComponent implements OnInit {
// The form object
  createExactMatchForm;

  constructor(  private formBuilder: FormBuilder,
                private questionService: QuestionService) {
                  // Creates an object to hold form values.
                  this.createExactMatchForm = this.formBuilder.group({
                    matchText: ''
                  });
                }

  ngOnInit() {
  }

  onSubmit(exactMatchData) {
    const exactMatch: ExactMatch = new ExactMatch();
    exactMatch.id = null;
    exactMatch.questionId = null;
    exactMatch.matchText = exactMatchData.matchText;

    // Resets the form values.
    this.createExactMatchForm.reset();

    // Adds option to the options array in the service.
    this.questionService.createExactMatch(exactMatch);

    // For testing, we can remove later.
    console.log({exactMatch});
  }
}
