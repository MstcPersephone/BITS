// Settings that we can use as switches when the user is building an assessment
// Properties that are in here now are just ideas. Not sure if we'll need them yet
export class AssessmentConfig {
  isRandom: boolean; // whether questions will be random
  duration: number; // 0 will be unlimited time
  wrongStreak: number; // how many wrong in a row
  minimumScore: number; // minimum percentage of passing assessment
}
