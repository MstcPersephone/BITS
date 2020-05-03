import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';
import { Question } from 'src/app/models/question.interface';

@Component({
  selector: 'app-view-attachment',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.css']
})
export class ViewAttachmentComponent implements OnInit, OnDestroy {

  @Input() question: Question;

  constructor(
    public attachmentService: AttachmentService
  ) { }

  ngOnInit() {
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
  }
}
