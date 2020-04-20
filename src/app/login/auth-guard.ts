import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { promise } from 'protractor';
import { Injectable } from '@angular/core';
import { LoginEngineService } from '../services/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginEngineService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot
              ): boolean | Observable<boolean> | Promise<boolean> {
      const isAuth = this.loginService.getIsAuth();
      if (!isAuth) {
      this.router.navigate(['/login']);
      }
      return isAuth;
  }

}
