import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Option } from '../shared/option.model';
import { Attachment } from '../shared/attachment.model';

// Muliple choice question that allows only one correct answer.
export class MultipleChoice implements Question {
  id: string;
  name: string;
  questionText: string;
  questionType = QuestionType.MultipleChoice;
  options: Option[];
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  duration: number;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.questionText = data.questionText;
    this.questionType = data.questionType;
    this.options = data.options;
    this.hasAttachments = data.hasAttachments;
    this.attachments = data.attachments;
    this.isAnswered = data.isAnswered;
    this.duration = data.duration;
  }
}
