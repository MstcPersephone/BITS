import { Assessment } from './assessment.model';
import { Student } from './student.model';
import { Question } from './question.interface';

export class TakenAssessment {
  // tslint:disable-next-line: variable-name
  _id: string;
  assessment: Assessment;
  student: Student;
  questions: Question[];
  score: number;
  studentPassed: boolean;
}
