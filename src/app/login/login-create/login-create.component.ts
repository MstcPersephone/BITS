import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginEngineService } from '../../services/login.service';
import { User } from '../../models/user.model';
import { HelperService } from 'src/app/services/helper.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-login-create',
  templateUrl: './login-create.component.html',
  styleUrls: ['./login-create.component.css']
})
export class LoginCreateComponent implements OnInit {
  signupForm;

  constructor(
    private formBuilder: FormBuilder,
    public loginService: LoginEngineService,
    public helperService: HelperService
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
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

      const passwordMatchResponse = ValidationService.validatePasswordMatch(formData.password1, formData.password2);

      if (passwordMatchResponse.result) {
        // If the passwords match, send data to backend to store the new user
        this.loginService.createUser(user);
      } else {
        if (!passwordMatchResponse.result) {
          // If the passwords don't match, open snackbar error message
          this.helperService.openSnackBar(passwordMatchResponse.message, 'OK', 'error-dialog', undefined);
        }

      }
    }
  }
}
