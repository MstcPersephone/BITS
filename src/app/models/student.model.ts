import { Score } from './score.model';

export class Student {
  // tslint:disable-next-line: variable-name
  _id: string;
  uniqueStudentIdentifier: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  campusLocation: string;
  lastAssessmentDate: Date;
  previousScores: Score[];
}
