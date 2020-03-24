// A possible answer to a question.
export class Option {
  _id: string;
  questionId: string;
  optionText: string;
  isAnswer: boolean;
  optionIsSelected: boolean;
}
