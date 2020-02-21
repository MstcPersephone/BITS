import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Essay } from 'src/app/models/question-types/essay.model';
import { Question } from 'src/app/models/question.interface';

@Component({
  selector: 'app-create-essay',
  templateUrl: './create-essay.component.html',
  styleUrls: ['./create-essay.component.css']
})
export class CreateEssayComponent implements OnInit {
// The form object
  createEssayForm;

  constructor(private formBuilder: FormBuilder) {
    this.createEssayForm = this.formBuilder.group({
      essayText: '',
      essayAnswer: ''
    });
     }

  ngOnInit(): void {
  }

    // Id is null at this point because it is generated on the backend.
    onSubmit(questionData) {
      const question: Question =  new Essay({
        id: null,
        questionText: questionData.essayText,
        hasAttachments: false,
        attachments: null,
        isAnswered: false,
        answer: questionData.essayAnswer,
        duration: 0
      });

      // Resets the form values.
      this.createEssayForm.reset();

      // For testing, we can remove later.
      console.log(question);
    }
}
