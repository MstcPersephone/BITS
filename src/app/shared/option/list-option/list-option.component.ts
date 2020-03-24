import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { Subscription } from 'rxjs';
import { Option } from '../../../models/shared/option.model';

@Component({
  selector: 'app-list-option',
  templateUrl: './list-option.component.html',
  styleUrls: ['./list-option.component.css']
})
export class ListOptionComponent implements OnInit {
  options: Option[] = [];

  // Used to subsribe to option changes to update the list.
  private optionsSubscription: Subscription;

  constructor(public questionService: QuestionService) { }

  ngOnInit() {
    // Sets up the subscription to listen for changes.
    this.optionsSubscription = this.questionService.getOptionsListener()
    .subscribe((optionsArray: Option[]) => {
      this.options = optionsArray;
    });
  }

}
