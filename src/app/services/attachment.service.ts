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

  uploadFiles($event, isCorrectAnswerFiles = false) {
      const files = Array.from($event.target.files);
      files.forEach((f: File) => {
        const attachment = new Attachment();
        attachment.id = null;
        attachment.name = f.name;
        attachment.fileType = f.type;
        attachment.content = f;
        if (isCorrectAnswerFiles) {
          this.correctAnswers.push(attachment);
        } else {
          this.attachments.push(attachment);
        }
        console.log(attachment);
      });
  }
}
