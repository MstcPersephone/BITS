import { Component, OnInit, Input } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {
  @Input() attachmentsLoaded;
  constructor(
    public attachmentService: AttachmentService,
    private helperService: HelperService
  ) { }

  ngOnInit() {
  }

}
