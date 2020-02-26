import { Injectable } from '@angular/core';
import { Attachment } from '../models/shared/attachment.model';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  attachments: Attachment[] = [];
  hasAttachments = false;
  constructor() { }

  // Gets attachments array
  getAttachments() {
    return [...this.attachments];
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

  uploadFile($event) {
      const f = $event.target.files[0];
      const attachment = new Attachment();
      attachment.id = null;
      attachment.name = f.name;
      attachment.fileType = f.type;
      attachment.content = f;
      this.attachments.push(attachment);
      console.log({attachment});
  }
}
