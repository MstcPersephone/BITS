import { Component } from '@angular/core';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    public helperService: HelperService) { }

}
