import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';
import { ExactMatch } from '../shared/exact-match.model';
import { Category } from '../shared/category.model';

// Essay question that that accepts a text response.
export class ShortAnswer implements Question {
  _id: string;
  categories: Category [];
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
  assessmentIds: string[];
}
