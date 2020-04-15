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
    this.loginForm = this.formBuilder.group({});
   }

  ngOnInit() {
  }

  onLogin(formData) {
    console.log(formData);
  }
}
