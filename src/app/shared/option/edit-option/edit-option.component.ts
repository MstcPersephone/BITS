import { Component, OnInit, Input } from '@angular/core';
import { Option } from 'src/app/models/shared/option.model';

@Component({
  selector: 'app-edit-option',
  templateUrl: './edit-option.component.html',
  styleUrls: ['./edit-option.component.css']
})
export class EditOptionComponent implements OnInit {
  @Input() option: Option;
  constructor() { }

  ngOnInit() {
  }

  onSubmit(formData) {
    console.log(formData);
  }
}
