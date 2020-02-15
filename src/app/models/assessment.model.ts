import { AssessmentConfig } from './assessment-config.model';
import { Question } from './question.interface';

export class Assessment {
  id: string;
  name: string;
  description: string;
  config: AssessmentConfig;
  questions: Question[];
}
