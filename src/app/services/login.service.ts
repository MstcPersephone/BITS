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
  private token: string;
  public isAdmin = false;

  constructor(
    private http: HttpClient,
    private router: Router ) { }

  getToken() {
    return this.token;
  }

  createUser(user: User) {
    console.log(user);
    this.http.post('http://localhost:3000/api/user/create', user)
    .subscribe(response => {
      console.log(response);
    });
  }

  loginUser(username: string, password: string) {
    const authUser: AuthData = {username, password};
    this.http.post<{token: string}>('http://localhost:3000/api/user/login', authUser)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
    });
  }

}
