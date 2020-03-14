import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/shared/category.model';
import { Question } from 'src/app/models/question.interface';
import { Assessment } from 'src/app/models/assessment.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css']
})
export class CreateAssessmentComponent implements OnInit {
  public questions: Question[] = [];
  private questionSubscription: Subscription;
  public assessmentQuestions = [] = [];

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
        console.log('All Questions: ');
        console.log(this.questions);
      });
  }

  buildAssessmentQuestions() {

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
    console.log('Available Questions: ');
    console.log(event.previousContainer.data);
    console.log('Assessment Questions: ');
    console.log(event.container.data);
  }

  onSubmit(assessmentData) {
    const assessment: Assessment = new Assessment();
    assessment._id = null;
    assessment.config = null;
    assessment.description = null;
    assessment.name = null;
    assessment.questionIds = null;
    assessment.status = null;

    // For testing, we can remove later.
    console.log(assessment);

    // Adds option to the options array in the service.
    // this.questionService.saveQuestion(trueFalseQuestion);
  }
}

