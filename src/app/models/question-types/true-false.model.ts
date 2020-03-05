import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';
import { Category } from '../shared/category.model';

// A true/false question.
export class TrueFalse implements Question {
  id: string;
  categories: Category [];
  questionText: string;
  questionType = QuestionType.TrueFalse;
  hasAttachments: boolean;
  attachments?: Attachment[];
  isAnswered: boolean;
  answer: boolean;
  studentAnswer: boolean;
  duration: number;
  isAnsweredCorrectly: boolean; // whether the user has provided the correct answer
}
