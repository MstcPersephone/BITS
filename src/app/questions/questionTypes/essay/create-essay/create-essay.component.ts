import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Essay } from 'src/app/models/question-types/essay.model';
import { QuestionService } from 'src/app/services/question.service';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'app-create-essay',
  templateUrl: './create-essay.component.html',
  styleUrls: ['./create-essay.component.css']
})
export class CreateEssayComponent implements OnInit {
// The form object
  createEssayForm;
  hasAttachments = false;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private attachmentSerivce: AttachmentService
              ) {
    this.createEssayForm = this.formBuilder.group({
      questionText: '',
      questionAnswer: '',
      hasAttachments: ''
    });
     }

  ngOnInit(): void {
  }

    // Id is null at this point because it is generated on the backend.
    onSubmit(questionData) {
      const essayQuestion: Essay =  new Essay();
      essayQuestion.id = null;
      essayQuestion.questionText = questionData.questionText;
      essayQuestion.hasAttachments = this.hasAttachments;
     // essayQuestion.attachments = this.hasAttachments ? this.attachmentSerivce.getAttachments() : null;
      essayQuestion.isAnswered = false;
      essayQuestion.matches = this.questionService.getMatches();
      essayQuestion.duration = 0;

      // Resets the form values.
      this.createEssayForm.reset();

      // Adds option to the options array in the service.
      this.questionService.saveQuestion(essayQuestion);

      // For testing, we can remove later.
      console.log(essayQuestion);
    }

    hasAttachmentsChanged() {
      this.hasAttachments = !this.hasAttachments;
    }
}
