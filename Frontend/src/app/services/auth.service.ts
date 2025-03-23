import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login/'; // Django API URL

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { userId: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((res: any) => {
        if (res.redirect_url) {
          // Redirect to user page upon successful login
          this.router.navigateByUrl("user-panel");
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of({ error: 'Invalid credentials' });
      })
    );
  }
}
