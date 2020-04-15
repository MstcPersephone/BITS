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
  signupForm;

  constructor(
    private formBuilder: FormBuilder,
    public loginService: LoginEngineService
    ) {
      this.signupForm = this.formBuilder.group({});
     }

  ngOnInit() {
  }

  onSignup(formData) {

  }
}
