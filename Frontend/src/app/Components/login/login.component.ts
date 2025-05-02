import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isAdmin: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    const { userId, password } = this.loginForm.value;
    this.errorMessage = '';

    this.authService.login({ userId, password }).subscribe((res) => {
      if (res?.error) {
        this.errorMessage = 'Invalid credentials!';
      }
    });
  }
}

