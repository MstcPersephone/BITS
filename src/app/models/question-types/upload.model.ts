import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';
import { Category } from '../shared/category.model';

// A question that allows an upload for an answer.
export class Upload implements Question {
  _id: string;
  categories: Category [];
  questionText: string;
  questionType = QuestionType.Upload;
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  duration: number;
  correctAnswer: Attachment[];
  submittedAnswer: Attachment[];
  points: number;
  isAnsweredCorrectly: boolean; // whether the user has provided the correct answer
  assessmentIds: string[];
}
