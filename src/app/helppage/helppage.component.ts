import { Component, OnInit } from '@angular/core';
import { LoginEngineService } from '../services/login.service';


@Component({
  selector: 'app-helppage',
  templateUrl: './helppage.component.html',
  styleUrls: ['./helppage.component.css']
})
export class HelppageComponent implements OnInit {

  constructor(public loginService: LoginEngineService) { }

  ngOnInit() {
  }

}
