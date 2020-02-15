import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Option } from './option.model';
import { Attachment } from '../attachment.model';

// Muliple choice question that allows only one correct answer.
export class MultipleChoice implements Question {
  id: number;  name: string;
  questionText: string;
  questionType = QuestionType.MultipleChoice;
  options: Option[];
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  duration: number;
}
