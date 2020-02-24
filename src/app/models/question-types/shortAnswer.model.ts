import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';
import { ExactMatch } from '../shared/exact-match.model';

// Essay question that that accepts a text response.
export class ShortAnswer implements Question {
  id: string;
  name: string;
  questionText: string;
  questionType = QuestionType.ShortAnswer;
  hasAttachments: boolean;
  attachments?: Attachment[];
  isAnswered: boolean;
  matches: ExactMatch[];
  duration: number;
}