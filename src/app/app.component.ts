import { Component, OnInit } from '@angular/core';
import { LoginEngineService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BITS';

  constructor(private loginService: LoginEngineService) {

  }

  ngOnInit() {
    this.loginService.autoAuthUser();
  }
}
