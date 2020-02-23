// Represents a score from taking an assessment
export class Score {
  id: string;
  assessmentId: string;
  numberOfQuestionsAsked: number;
  numberOfCorrectAnswers: number;
  isPassingScore: boolean;
  scoreResultText: string;
}
