import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../attachment.model';

// A true/false question.
export class TrueFalse implements Question {
  id: number;  name: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: number;
  weight: number;
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  duration: number;
  answer: boolean;
}
