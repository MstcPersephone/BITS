import { AssessmentConfig } from './assessment-config.model';
import { Question } from './question.interface';

export class Assessment {
  _id: string;
  name: string;
  description: string;
  config: AssessmentConfig;
  questionIds: string[];
  status: string;
}
