import { Question } from '../question.interface';
import { QuestionType } from 'src/app/enums/questionType.enum';
import { Option } from '../shared/option.model';
import { Attachment } from '../shared/attachment.model';
import { Category } from '../shared/category.model';

// Checkbox question that allows more than one correct answer.
export class Checkbox implements Question {
  // tslint:disable-next-line: variable-name
  _id: string;
  categories: Category [];
  questionText: string;
  questionType = QuestionType.CheckBox;
  options: Option[];
  hasAttachments: boolean;
  attachments?: Attachment[];
  isAnswered: boolean;
  duration: number;
  points: number;
  isAnsweredCorrectly: boolean; // whether the user has provided the correct answer
}
