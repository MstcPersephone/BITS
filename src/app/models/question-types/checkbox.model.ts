import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Option } from '../shared/option.model';
import { Attachment } from '../shared/attachment.model';

// Muliple choice question that allows more than one correct answer.
export class Checkbox implements Question {
  id: string;
  questionText: string;
  questionType = QuestionType.CheckBox;
  options: Option[];
  hasAttachments: boolean;
  attachments: Attachment[];
  isAnswered: boolean;
  answers: Option[];
  duration: number;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.questionText = data.questionText;
    this.questionType = data.questionType;
    this.options = data.options;
    this.hasAttachments = data.hasAttachments;
    this.attachments = data.attachments;
    this.isAnswered = data.isAnswered;
    this.answers = data.answers;
    this.duration = data.duration;
  }
}
