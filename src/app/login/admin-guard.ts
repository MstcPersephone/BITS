import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { promise } from 'protractor';
import { Injectable } from '@angular/core';
import { LoginEngineService } from '../services/login.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private loginService: LoginEngineService,
              private router: Router) {}

  // Function to check admin status to restrict access and reroute unauthorized users
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot
              ): boolean | Observable<boolean> | Promise<boolean> {
      const isAdmin = this.loginService.isAdmin;
      if (!isAdmin) {
      this.router.navigate(['/home']);
      }
      return isAdmin;
  }
}
