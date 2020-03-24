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

  studentAnswers: Attachment[] = [];

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

  // Gets the student answers array
  getStudentAnswers() {
    return [...this.studentAnswers];
  }

  // Gets the attachment file names
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

  resetAttachments() {
    this.attachments = [];
    this.hasAttachments = false;
  }

  // Convert JS file into Attachment.
  // Convert file content to binary string.
  uploadFiles($event: Event, uploadType: string) {

      // Convert the uploaded files into an array of files to loop through.
      const files = Array.from(($event.target as HTMLInputElement).files);

      // Convert each file into an attachment.
      files.forEach((f: File) => {

        // Create and set values of attachment.
        const attachment = new Attachment();
        attachment._id = null;
        attachment.name = f.name;
        attachment.fileSize = f.size;
        attachment.fileType = f.type;

        // FileReader to convert file content into a binary string.
        const reader = new FileReader();

        // When the reader loads (is done processing) store the results in attachment.
        reader.onload = () => {
          // The binary string of the file
          console.log(reader.result);

          // This triggers an HTML element that shows file names
          // see attachment.component.html
          this.hasAttachmentFileNames = true;

          // Assigning binary string to attachment content property
          attachment.content = reader.result;

          switch (uploadType) {
            case 'studentAnswer':
                // Student uploaded answer files.
                this.studentAnswers.push(attachment);
                break;
            case 'correctAnswer':
                // Instructor uploaded correct answer files
                this.correctAnswers.push(attachment);
                break;
            default:
              // Instructor uploaded attachment to accompany a quesiton
              this.attachments.push(attachment);
              break;
          }

          console.log(attachment.content);
        };

        // Start up the reader and tell it to convert the file to binary string.
        reader.readAsDataURL(f);
      });
  }

  downloadAttachment(attachment: Attachment) {
    const dataUri = attachment.content;
    const blob = this.dataUriToBlob(dataUri);
    console.log(blob);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = attachment.name;
    setTimeout(() => {
      link.click();
    }, 0);
  }

  // Converts the dataUri (how the file is stored in the database) to a JS Blob
  dataUriToBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    const ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], {type: mimeString});

    return blob;
  }
}
