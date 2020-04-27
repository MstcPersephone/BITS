// A possible answer to a question.
export class Option {
  // tslint:disable-next-line: variable-name
  _id: string;
  questionId: string;
  optionText: string;
  isAnswer: boolean;
  optionIsSelected: boolean;
}
