import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../attachment.model';

// A question that allows an upload for an answer.
export class Upload implements Question {
  id: number;  name: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: number;
  weight: number;
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  duration: number;
  answer: Attachment;
}
