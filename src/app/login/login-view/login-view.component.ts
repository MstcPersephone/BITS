import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginEngineService } from '../../services/login.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {
  loginForm;
  constructor(
    private formBuilder: FormBuilder,
    public loginService: LoginEngineService,
    public helperService: HelperService
  ) {
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
   }

  ngOnInit() {
  }

  onLogin(formData) {
    const username = formData.username.toLowerCase();
    this.loginService.loginUser(username, formData.password);
    this.loginForm.reset();
  }
}
