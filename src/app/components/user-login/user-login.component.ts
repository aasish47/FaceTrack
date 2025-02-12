import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {


  constructor(private router: Router) { }

  username: string = '';
  password: string = '';

  goToHome() {
    this.router.navigate(['/home']);
  }
  login(event: Event) {
    event.preventDefault();
    if (this.username === 'user' && this.password === 'password') {
      localStorage.setItem('userLoggedIn', 'true');
      console.log("Admin Logged In Success");
      this.router.navigate(['/user-dashboard']);
    } else {
      alert('Invalid credentials');
    }
  }
}
