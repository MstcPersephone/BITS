import { Score } from './score.model';

export class Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  campusLocation: string;
  lastAssessmentDate: Date;
  previousScores: Score[];
}
