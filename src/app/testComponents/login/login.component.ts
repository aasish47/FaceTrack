import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isAdmin: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  toggleLogin() {
    this.isAdmin = !this.isAdmin;
    this.loginForm.reset(); 
    this.errorMessage = '';
  }

  onLogin() {
    const { username, password } = this.loginForm.value;
    this.errorMessage = ''; 

    if (!this.isAdmin && username === 'user' && password === 'password') {
      localStorage.setItem('userLoggedIn', 'true');
      console.log("User Logged In Successfully");
      this.router.navigate(['/user-panel']);
    } else if (this.isAdmin && username === 'admin' && password === 'password') {
      localStorage.setItem('adminLoggedIn', 'true');
      console.log("Admin Logged In Successfully");
      this.router.navigate(['/admin-panel']);
    } else {
      this.errorMessage = 'Invalid credentials!';
    }
  }
}

