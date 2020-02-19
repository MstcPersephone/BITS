import { AssessmentConfig } from './assessment-config.model';
import { Question } from './question.interface';

export class Assessment {
  id: string;
  name: string;
  description: string;
  config: AssessmentConfig;
  questions: Question[];

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.config = data.config;
    this.questions = data.questions;
  }
}
