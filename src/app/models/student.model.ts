import { Score } from './score.model';

export class Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  campusLocation: string;
  assessmentDate: Date;
  previousScores: Score[];
}
