import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginEngineService } from '../../services/login.service';
import { User } from '../../models/user.model';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login-create',
  templateUrl: './login-create.component.html',
  styleUrls: ['./login-create.component.css']
})
export class LoginCreateComponent implements OnInit {
  isLoading = false;
  signupForm;

  constructor(
    private formBuilder: FormBuilder,
    public loginService: LoginEngineService,
    public helperService: HelperService
    ) {
      this.signupForm = this.formBuilder.group({
        username: '',
        password1: '',
        password2: '',
        isAdmin: ''
      });
     }

  ngOnInit() {
  }

  onSignup(formData) {
    const username = formData.username.toLowerCase();

    // Check that the passwords match and create new user if they do
    if (formData.password1 === formData.password2) {

    const user = new User();
    user.username = username;
    user.password = formData.password1;
    if (formData.isAdmin === true) {
      user.isAdmin = true;
    } else {
      user.isAdmin = false;
    }

    this.loginService.createUser(user);
   } else {
      alert('Passwords don\'t match, please try again');
    }
  }
}
