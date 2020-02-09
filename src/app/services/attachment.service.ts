import { Injectable } from '@angular/core';
import { Attachment } from '../models/attachment.model';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {

  constructor() { }

  // Adds attachments to a question
  addAttachments(attachments: Attachment[]) {

  }

  // Remove attachment from question
  removeAttachment(attachmentId: number) {

  }
}
