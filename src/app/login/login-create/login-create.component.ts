import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginEngineService } from '../../services/login.service';
import { User } from '../../models/user.model';
import { HelperService } from 'src/app/services/helper.service';
import { ValidationService } from '../../services/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-create',
  templateUrl: './login-create.component.html',
  styleUrls: ['./login-create.component.css']
})
export class LoginCreateComponent implements OnInit {
  signupForm;
  newUser: any;
  newUserSubscription: Subscription;


  constructor(
    private formBuilder: FormBuilder,
    public loginService: LoginEngineService,
    public helperService: HelperService
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, ValidationService.emailValidator]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
      isAdmin: ''
    });
  }

  ngOnInit() {
  }

  onSignup(formData) {
    const username = formData.username.toLowerCase();

    const user = new User();
    user.username = username;
    user.password = formData.password1;
    if (formData.isAdmin === true) {
      user.isAdmin = true;
    } else {
      user.isAdmin = false;
    }

    // Calls validation errors on the current form when submit button is clicked
    if (!this.signupForm.valid) {
      // Marks all controls as touched so error messages may populate
      (Object as any).values(this.signupForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // Second pass at validation to ensure that the passwords match
    if (this.signupForm.valid) {

      this.loginService.findLogin(formData.username.toLowerCase());
      this.newUserSubscription = this.loginService.getNewUserListener()
        .subscribe((userData: any) => {
          this.newUser = userData.username;

          const passwordMatchResponse = ValidationService.validatePasswordMatch(formData.password1, formData.password2);

          const loginMatchResponse = ValidationService.validateUserNameMatch(this.newUser, user);

          if (!passwordMatchResponse.result) {
            console.log('Passwords dont match');

            // If the passwords don't match, open snackbar error message
            this.helperService.openSnackBar(passwordMatchResponse.message, 'OK', 'error-dialog', undefined);
          } else if (!loginMatchResponse.result) {
            console.log('User already exists');

            // If user already exists, open snackbar error message
            this.helperService.openSnackBar(loginMatchResponse.message, 'OK', 'error-dialog', undefined);
          } else {
            console.log('Ok to save');

            // If the passwords match, send data to backend to store the new user
            this.loginService.createUser(user);
          }
        });
    }
  }
}
