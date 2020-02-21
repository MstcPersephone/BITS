import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Attachment } from '../shared/attachment.model';

// A question that allows an upload for an answer.
export class Upload implements Question {
  id: string;
  questionText: string;
  questionType = QuestionType.Upload;
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  duration: number;
  correctAnswer: Attachment;
  submittedAnswer: Attachment;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.questionText = data.questionText;
    this.questionType = data.questionType;
    this.hasAttachments = data.hasAttachments;
    this.attachments = data.attachments;
    this.isAnswered = data.isAnswered;
    this.duration = data.duration;
    this.correctAnswer = data.correctAnswer;
    this.submittedAnswer = data.submittedAnswer;
  }
}
