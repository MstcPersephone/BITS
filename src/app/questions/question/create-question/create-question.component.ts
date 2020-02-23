import { Component, OnInit, ViewChild } from '@angular/core';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {
  questionSelectionFormGroup;

  questionTypes = [];
  questionTypeSelected: string;

  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
    // gets the question types from the QuestionType enum
    this.questionTypes = this.helperService.getQuestionTypes();
  }

  // Sets the variable for the ngSwitch statement in html file
  // Function is triggered after user selects an option
  onQuestionTypeSelected(event) {
    this.questionTypeSelected = event.value;
    console.log(this.questionTypeSelected + ' Question Selected');
  }

}
