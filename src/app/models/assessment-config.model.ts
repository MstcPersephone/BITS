// Settings that we can use as switches when the user is building an assessment
// Properties that are in here now are just ideas. Not sure if we'll need them yet
export class AssessmentConfig {
  allowBack: boolean; // navigate to previously submitted answers
  allowReview: boolean; // allow changing of answers
  duration: number; // 0 will be unlimited time
}
