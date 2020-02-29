// Used for uploading answers or including files in a question.
export class Attachment {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  content: string | ArrayBuffer;
}
