// A possible answer to a question.
export class ExactMatch {
  id: string;
  questionId: string;
  matchText: string;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.questionId = data.questionId;
    this.matchText = data.matchText;
  }
}
