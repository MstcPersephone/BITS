// A possible answer to a question.
export class Option {
  id: string;
  questionId: string;
  optionText: string;
  isAnswer: boolean;
  isSelected: boolean;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.questionId = data.questionId;
    this.optionText = data.optionText;
    this.isAnswer = data.isAnswer;
    this.isSelected = data.isAnswer;
  }
}
