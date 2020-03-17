// Settings that we can use as switches when the user is building an assessment

import { Time } from '@angular/common';

// Properties that are in here now are just ideas. Not sure if we'll need them yet
export class AssessmentConfig {
  isRandom: boolean; // whether questions will be random
  isTimed: boolean; // whether questions will be timed
  maxTime: Time; // the max time allowed for a timed assessment
  duration: number; // 0 will be unlimited time
  wrongStreak: number; // how many wrong in a row
  minimumScore: number; // minimum percentage of passing assessment
}
