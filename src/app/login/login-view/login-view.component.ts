import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginEngineService } from '../../services/login.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {
  isLoading = false;
  loginForm;
  constructor(
    private formBuilder: FormBuilder,
    public loginService: LoginEngineService
  ) {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
   }

  ngOnInit() {
  }

  onLogin(formData) {
    let username = formData.username.toLowerCase();
    this.isLoading = true;
    this.loginService.loginUser(username, formData.password);
    this.isLoading = false;
  }
}
