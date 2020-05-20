import { AssessmentConfig } from './assessment-config.model';
import { Question } from './question.interface';

// Used for creating an assessment
export class Assessment {
  // tslint:disable-next-line: variable-name
  _id: string;
  name: string;
  description: string;
  config: AssessmentConfig;
  questionIds: string[];
  status: string;
}
