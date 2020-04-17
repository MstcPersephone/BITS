import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginEngineService } from '../../services/login.service';
import { User } from '../../models/user.model';

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
    public loginService: LoginEngineService
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
    if (formData.password1 === formData.password2) {
    const user = new User();
    user.username = formData.username;
    user.password = formData.password1;
    user.isAdmin = formData.isAdmin;

    this.loginService.createUser(user);
    } else {
      alert('Passwords don\'t match, please try again');
    }
  }
}
