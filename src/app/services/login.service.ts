import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthData } from '../models/auth-data.model';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class LoginEngineService {
  // The token string generated by the backend
  private token: string;
  // Value to determine if the user is an admin
  public isAdmin = false;
  // Value to determine if the user is logged in
  private isAuthenticated = false;
  // Subject to update the authentication status
  private authStatusListener = new Subject<boolean>();
  // The timer for the expiration of the token
  private tokenTimer: any;

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private router: Router ) { }

  // Gets the authentication status listener
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // Gets the authentication status
  getIsAuth() {
    return this.isAuthenticated;
  }

  // Gets the token
  getToken() {
    return this.token;
  }

  // The function to create a new user
  createUser(user: User) {
    console.log(user);
    this.http.post('http://localhost:3000/api/user/create', user)
    .subscribe(response => {
      console.log(response);
      this.helperService.openSnackBar('User creation successful!', 'Close', 'success-dialog', 5000);
      this.router.navigate(['/home']);
    });
  }

  // The function to log in a user
  loginUser(username: string, password: string) {
    // Pass username and password values to the backend
    const authUser: AuthData = {username, password};
    this.http.post<{token: string, expiresIn: number, isAdmin: boolean}>('http://localhost:3000/api/user/login', authUser)
    .subscribe(response => {
      // Grab token from response and store in the service
      const token = response.token;
      this.token = token;
      // If token exists, change authorization status and reroute to homepage
      if (token) {
        this.helperService.openSnackBar('Login successful!', 'Close', 'success-dialog', 5000);
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAdmin = response.isAdmin;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, response.isAdmin);
        this.router.navigate(['/home']);
       }
      },
    error => {
      this.helperService.openSnackBar('Login failed!', 'Close', 'error-dialog', 5000);
      this.helperService.refreshComponent('/login');
    });
  }

  // Automatically checks from auth data in local storage on refresh to keep user signed in
  autoAuthUser() {
    const authInformation = this.getAuthData();
    // If auth information doesn't exist in local storage return
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    // Check if the token isn't expired
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.isAdmin = (authInformation.isAdmin === 'true');
      this.authStatusListener.next(true);
    }
  }

  // The function to log out a user - destory token, change auth status, notify listeners and navigate away
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  // Sets the timer for the token
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  // Saves the auth data to the local storage
  private saveAuthData(token: string, expirationDate: Date, isAdmin: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('isAdmin', isAdmin.toString());
  }

  // clears the auth data from the local storage
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('isAdmin');
  }

  // Gets the authentication data from local storage
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const isAdmin = localStorage.getItem('isAdmin');
    if (!token || !expirationDate || !isAdmin) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      isAdmin
    };
  }
}
