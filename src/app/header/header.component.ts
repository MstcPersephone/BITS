import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginEngineService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private loginService: LoginEngineService,
              public helperService: HelperService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.loginService.getIsAuth();
    this.authListenerSubs = this.loginService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.loginService.logout();
  }

  ngOnDestroy() {

  }
}
