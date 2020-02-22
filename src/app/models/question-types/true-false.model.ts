import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';

// A true/false question.
export class TrueFalse implements Question {
  id: string;
  questionText: string;
  questionType = QuestionType.TrueFalse;
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  answer: boolean;
  duration: number;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.questionText = data.questionText;
    this.hasAttachments = data.hasAttachments;
    this.attachments = data.attachments;
    this.isAnswered = data.isAnswered;
    this.answer = data.answer;
    this.duration = data.duration;
  }
}
