import { QuestionType } from '../enums/questionType.enum';
import { Attachment } from './shared/attachment.model';
import { Category } from './shared/category.model';

export interface Question {
  id: string; // unique identifier
  categories: Category []; // the categories assined to the question
  questionText: string; // the question text
  questionType: QuestionType; // enum value
  hasAttachments: boolean; // whether or not files are attached to the question
  attachments?: Attachment[]; // list of files for the question
  isAnswered: boolean; // whether the user has answered the question
  duration: number; // how long it takes to answer the question
  points: number; // the point value for the question
  isAnsweredCorrectly: boolean; // whether the user has provided the correct answer
}
