import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthData } from '../models/auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class LoginEngineService {

  public isAdmin = false;

  constructor(
    private http: HttpClient,
    private router: Router ) { }

  createUser(username: string, password: string, isAdmin: boolean) {
    const authData: AuthData = {username, password};

    this.http.post('http://localhost:300/api/user/signup', authData)
    .subscribe(response => {
      console.log(response);
    });
  }

}
