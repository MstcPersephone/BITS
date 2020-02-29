import { Injectable } from '@angular/core';
import { Attachment } from '../models/shared/attachment.model';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  // Array of attachments that are uploaded
  attachments: Attachment[] = [];
  attachmentsFileNames: string;
  hasAttachments = false;
  hasAttachmentFileNames = false;

  correctAnswers: Attachment[] = [];

  constructor() { }

  getAttachmentFileNames(attachmentArrayName: string) {
    let fileNames: string;
    if (attachmentArrayName === 'attachments') {
      this.attachments.forEach((a, index) => {

        // If there is only one file uploaded,
        // display that file name.
        if (this.attachments.length === 1) {
          fileNames = a.name;
        } else {
          // build comma separated list of file names

          // consts to build the string
          const name = a.name;
          const commaAndSpace = ', ';

          // unless it's the first file name in the list,
          // add a space after the preceeding comma
          fileNames += index === this.attachments.length - 1 ?
            a.name : a.name + commaAndSpace;
        }
      });

      return fileNames;
    }
  }

  // Gets attachments array
  getAttachments() {
    return [...this.attachments];
  }

  // Gets correct answers array
  getCorrectAnswers() {
    return [...this.correctAnswers];
  }

  getAttachmentsFileNames() {
    return this.attachmentsFileNames;
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
      this.hasAttachmentFileNames = true;
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
