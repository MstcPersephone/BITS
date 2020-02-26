import { Component, OnInit } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {

  constructor(
    public attachmentService: AttachmentService
  ) { }

  ngOnInit() {
  }

  uploadFile($event) {
    console.log($event.target.files[0]);
  }

}
