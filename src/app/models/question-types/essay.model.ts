import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../attachment.model';

// Essay question that that accepts a text response.
export class Essay implements Question {
  id: string;
  questionText: string;
  name: string;
  questionType = QuestionType.Essay;
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  duration: number;
  answer: string;
}
