import { Component, OnInit } from '@angular/core';
import { LoginEngineService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Sets the title of the application
  title = 'Skills Assessment';

  constructor(private loginService: LoginEngineService) {

  }
  // Checks to automatically authorize a user if token is still valid
  ngOnInit() {
    this.loginService.autoAuthUser();
  }
}
