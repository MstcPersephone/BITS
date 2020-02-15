import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Option } from '../option.model';
import { Attachment } from '../attachment.model';

// Muliple choice question that allows more than one correct answer.
export class Checkbox implements Question {
  id: string;
  questionText: string;
  name: string;
  questionType = QuestionType.CheckBox;
  options: Option[];
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  answers: Option[];
  duration: number;
}
