import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { Subscription } from 'rxjs';
import { ExactMatch } from 'src/app/models/shared/exact-match.model';

@Component({
  selector: 'app-list-exact-match',
  templateUrl: './list-exact-match.component.html',
  styleUrls: ['./list-exact-match.component.css']
})
export class ListExactMatchComponent implements OnInit {
  exactMatches: ExactMatch[] = [];

  private matchSubscription: Subscription;

  constructor(public questionService: QuestionService) { }

  ngOnInit() {
      // Sets up the subscription to listen for changes.
      this.matchSubscription = this.questionService.getMatchesListener()
      .subscribe((matchesArray: ExactMatch[]) => {
        this.exactMatches = matchesArray;
      });
  }

}
