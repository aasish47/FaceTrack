import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  constructor (private router : Router) {}

  username: string = '';
  password: string = '';

  goToHome() {
    this.router.navigate(['/home']);
  }
  login(event: Event){
    event.preventDefault();
    // console.log(this.username,this.password);
    if(this.username === 'admin' && this.password === 'password'){
      localStorage.setItem('adminLoggedIn', 'true');
      console.log("Admin Logged In Success");
      this.router.navigate(['/admin-dashboard']);
    } else {
      alert('Invalid credentials');
    }
  }
}
