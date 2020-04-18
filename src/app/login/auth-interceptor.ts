import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginEngineService } from '../services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginEngineService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.loginService.getToken();
    const authRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
