import { Component, OnInit, Input } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';
import { Question } from 'src/app/models/question.interface';

@Component({
  selector: 'app-view-attachment',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.css']
})
export class ViewAttachmentComponent implements OnInit {

  @Input() question: Question;

  constructor(
    public attachmentService: AttachmentService
  ) { }

  ngOnInit() {
  }

}
