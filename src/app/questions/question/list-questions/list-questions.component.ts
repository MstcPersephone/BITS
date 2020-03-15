import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/shared/category.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.css']
})
export class ListQuestionsComponent implements OnInit {
  // Object contains a property for each category
  // each property has an array of quesitons for a value
  public organizedQuestions = {};
  private questionSubscription: Subscription;

  constructor(
    public questionService: QuestionService,
    public attachmentService: AttachmentService,
    public helperService: HelperService
  ) { }

  ngOnInit() {

    // gets the call to api end point to collect all questions from database
    this.questionService.getAllQuestions();
    // subsribe to observer to get question array changes
    this.questionSubscription = this.questionService.getQuestionsUpdatedListener()
      .subscribe((questionsArray: any) => {
        this.organizedQuestions = questionsArray;
      });
  }
}
