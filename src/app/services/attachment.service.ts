import { Injectable } from '@angular/core';
import { Attachment } from '../models/shared/attachment.model';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  attachments: Attachment[] = [];
  hasAttachments = false;

  correctAnswers: Attachment[] = [];

  constructor() { }

  // Gets attachments array
  getAttachments() {
    return [...this.attachments];
  }

  // Gets correct answers array
  getCorrectAnswers() {
    return [...this.correctAnswers];
  }

  // Adds attachments to a question
  addAttachments(attachments: Attachment[]) {

  }

  // Remove attachment from question
  removeAttachment(attachmentId: number) {

  }

  hasAttachmentsChanged() {
    this.hasAttachments = !this.hasAttachments;
  }

  // Convert JS file into Attachment.
  // Convert file content to binary string.
  uploadFiles($event: Event, isCorrectAnswerFiles = false) {

      // Convert the uploaded files into an array of files to loop through.
      const files = Array.from(($event.target as HTMLInputElement).files);

      // Convert each file into an attachment.
      files.forEach((f: File) => {

        // Create and set values of attachment.
        const attachment = new Attachment();
        attachment.id = null;
        attachment.name = f.name;
        attachment.fileSize = f.size;
        attachment.fileType = f.type;

        // FileReader to convert file content into a binary string.
        const reader = new FileReader();

        // When the reader loads (is done processing) store the results in attachment.
        reader.onload = () => {
          // The binary string of the file
          console.log(reader.result);

          // Assigning binary string to attachment content property
          attachment.content = reader.result;

          // Pushing the newly created Attachment object to the right array
          if (isCorrectAnswerFiles) {
          // Instructor uploaded correct answer files
          this.correctAnswers.push(attachment);
        } else {
          // Instructor uploaded attachment to accompany a quesiton OR
          // Uploaded files from the student as an answer to Upload questionType.
          this.attachments.push(attachment);
        }
          console.log(attachment.content);
        };

        // Start up the reader and tell it to convert the file to binary string.
        reader.readAsBinaryString(f);

      });
  }
}
