import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginEngineService } from '../../services/login.service';

@Component({
  selector: 'app-login-create',
  templateUrl: './login-create.component.html',
  styleUrls: ['./login-create.component.css']
})
export class LoginCreateComponent implements OnInit {
  isLoading = false;
  constructor(
    public loginService: LoginEngineService
    ) { }

  ngOnInit() {
  }

  onSignup(formData) {

  }
}
