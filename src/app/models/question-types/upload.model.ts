import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';

// A question that allows an upload for an answer.
export class Upload implements Question {
  id: string;
  name: string;
  questionText: string;
  questionType = QuestionType.Upload;
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  duration: number;
  correctAnswer: Attachment;
  submittedAnswer: Attachment;
}
