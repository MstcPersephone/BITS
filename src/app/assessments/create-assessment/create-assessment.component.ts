import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { Question } from 'src/app/models/question.interface';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/shared/category.model';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css']
})
export class CreateAssessmentComponent implements OnInit {
  public organizedQuestions = [];
  public categories: Category[] = [];
  private categorySubscription: Subscription;
  public questions: Question[] = [];
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
      .subscribe((questionsArray: Question[]) => {
        this.questions = questionsArray;
        // call to function to short questions by category
        console.table(this.questions);
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}

