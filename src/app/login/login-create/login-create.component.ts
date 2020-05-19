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
    // convert form input value for username to lowercase
    const username = formData.username.toLowerCase();

    // Create the new user from input values
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

    if (this.signupForm.valid) {
      // Second pass at validation to ensure that the passwords match
      const passwordMatchResponse = ValidationService.validatePasswordMatch(formData.password1, formData.password2);

      if (!passwordMatchResponse.result) {
        // If the passwords don't match, open snackbar error message
        this.helperService.openSnackBar(passwordMatchResponse.message, 'OK', 'error-dialog', undefined);
      } else if (passwordMatchResponse.result) {
        // if all other validation passes, next check if the username is already used
        // Validation message will be called from service findLogin() if already exists
        this.loginService.findLogin(formData.username.toLowerCase());
        this.newUserSubscription = this.loginService.getNewUserListener()
          .subscribe((userData: any) => {
            this.newUser = userData.username;
          });

        // If the username is not already in use, create the new user
        this.loginService.createUser(user);
      }
    }
  }
}
