import { Score } from './score.model';
// Represents a student taking an assessment
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
