// Used for uploading answers or including files in a question.
export class Attachment {
  id: string;
  name: string;
  fileType: string;
  content: File;

  constructor(data: any) {
    data = data || {};
    this.id = data.id;
    this.name = data.name;
    this.fileType = data.fileType;
  }
}
