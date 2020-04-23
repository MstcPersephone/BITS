import { Injectable } from '@angular/core';
import { Attachment } from '../models/shared/attachment.model';
import { Constants } from '../shared/constants';
import { UploadType } from '../enums/uploadType.enum';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  // Array of attachments that are uploaded
  attachments: Attachment[] = [];
  attachmentsFileNames: string;
  hasAttachments = false;

  correctAnswers: Attachment[] = [];

  studentAnswers: Attachment[] = [];

  constructor() { }

  attachmentsExist() {
    return this.attachments.length !== 0;
  }

  correctAnswersExist() {
    return this.correctAnswers.length !== 0;
  }

  studentAnswersExist() {
    return this.studentAnswers.length !== 0;
  }

  // Check to see if the file is an image
  checkForImageFileType(fileType: string): boolean {
    return Constants.imageFileTypes.includes(fileType);
  }

  openImageInNewTab(attachment: Attachment) {
    const image = new Image();
    image.src = attachment.content;
    const w = window.open('');
    w.document.write(image.outerHTML);
  }

  clearStudentAnswers() {
    this.studentAnswers = [];
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

  // Remove attachment from question
  removeAttachment(a: Attachment, uploadType: string = 'attachment') {
    let index: number;
    switch (uploadType) {
      case UploadType.StudentAnswer:
        // Get the index of the attachment
        index = this.studentAnswers.indexOf(a);
        // Student uploaded answer files.
        this.studentAnswers.splice(index, 1);
        break;
      case UploadType.CorrectAnswer:
        index = this.correctAnswers.indexOf(a);
        // Instructor uploaded correct answer files
        this.correctAnswers.splice(index, 1);
        break;
      // Also currently the default behavior
      case UploadType.Attachment:
      default:
        index = this.attachments.indexOf(a);
        // Instructor uploaded attachment to accompany a quesiton
        this.attachments.splice(index, 1);
        break;
    }
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
  uploadFiles($event: Event, uploadType: string = 'attachment') {

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

        // Assigning binary string to attachment content property
        attachment.content = reader.result;

        switch (uploadType) {
          case UploadType.StudentAnswer:
            // Student uploaded answer files.
            this.studentAnswers.push(attachment);
            break;
          case UploadType.CorrectAnswer:
            // Instructor uploaded correct answer files
            this.correctAnswers.push(attachment);
            break;
          case UploadType.Attachment:
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
    const blob = new Blob([ab], { type: mimeString });

    return blob;
  }
}
