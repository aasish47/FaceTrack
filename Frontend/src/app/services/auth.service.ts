import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login/'; // Django API URL

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { userId: string; password: string; role: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((res: any) => {
        if (res.message === 'Login successful') {
          // Redirect based on role
          if (credentials.role.toLowerCase() === 'admin') {
            localStorage.setItem('adminLoggedIn', 'true');
            this.router.navigateByUrl('/admin-panel');
          } else {
            sessionStorage.setItem('userId', credentials.userId);
            localStorage.setItem('userLoggedIn', 'true');
            this.router.navigateByUrl('/user-panel');
          }
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of({ error: 'Invalid credentials or server error' });
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('userId') !== null;
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('userRole');
  }
}