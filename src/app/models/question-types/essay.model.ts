import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';

// Essay question that that accepts a text response.
export class Essay implements Question {
  id: string;
  name: string;
  questionText: string;
  questionType = QuestionType.Essay;
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  answer: string;
  duration: number;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.questionText = data.questionText;
    this.questionType = data.questionType;
    this.hasAttachments = data.hasAttachments;
    this.attachments = data.attachments;
    this.isAnswered = data.isAnswered;
    this.answer = data.answer;
    this.duration = data.duration;
  }
}
