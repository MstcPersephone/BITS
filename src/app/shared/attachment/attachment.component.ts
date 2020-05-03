import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit, OnDestroy {
  @Input() attachmentsLoaded;
  constructor(
    public attachmentService: AttachmentService,
    private helperService: HelperService
  ) { }

  ngOnInit() {
  }

  // Reset services so they can be used by a new component
  ngOnDestroy() {
    this.attachmentService.resetService();
  }
}
