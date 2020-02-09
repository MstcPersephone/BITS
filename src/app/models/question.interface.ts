import { QuestionType } from '../enums/questionType.enum';
import { Attachment } from './attachment.model';

export interface Question {
  id: number; // unique identifier
  questionText: string; // the question text
  questionType: QuestionType; // enum value
  difficulty: number; // scale 1-10 how hard the question is
  weight: number; // scale 1-100 how important this question is
  hasAttachments: boolean; // whether or not files are attached to the question
  attachments: Attachment[]; // list of files for the question
  isAnswered: boolean; // whether the user has answered the question
  duration: number; // how long it takes to answer the question
}
