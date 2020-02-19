// A possible answer to a question.
export class Option {
  id: string;
  questionId: string;
  name: string;
  isAnswer: boolean;
  isSelected: boolean;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.questionId = data.questionId;
    this.name = data.name;
    this.isAnswer = data.isAnswer;
    this.isSelected = data.isAnswer;
  }
}
