import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginEngineService } from '../../services/login.service';
import { HelperService } from 'src/app/services/helper.service';
import { ValidationService } from '../../services/validation.service';

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
      username: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
  }

  onLogin(formData) {
    const username = formData.username.toLowerCase();

    // Calls validation errors on the current form when submit button is clicked
    if (!this.loginForm.valid) {
      // Marks all controls as touched so error messages may populate
      (Object as any).values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    if (!this.loginForm.valid) {
      this.loginService.loginUser(username, formData.password);
      this.loginForm.reset();
    }
  }
}
