import { Component, OnInit } from '@angular/core';
import { LoginEngineService } from '../services/login.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(public loginService: LoginEngineService) { }

  ngOnInit() {
  }

}
