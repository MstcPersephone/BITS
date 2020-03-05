import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';
import { ExactMatch } from '../shared/exact-match.model';

// Essay question that that accepts a text response.
export class ShortAnswer implements Question {
  id: string;
  questionText: string;
  questionType = QuestionType.ShortAnswer;
  hasAttachments: boolean;
  attachments?: Attachment[];
  isAnswered: boolean;
  studentAnswer: string;
  matches: ExactMatch[];
  duration: number;
  points: number;
  isAnsweredCorrectly: boolean; // whether the user has provided the correct answer
}
