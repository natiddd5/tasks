import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  async registerUser(email: string, password: string) {
    const authData = { email, password };
    try {
      const response: any = await firstValueFrom(this.http.post('http://localhost:4000/api/user/register', authData));
      this.userId = response.userId;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      alert('Connected successfully');
      this.router.navigate(['/posts']);
      return response;
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      if (httpError.status === 409) {
        alert('Email already exists. Please use a different email.');
      }
      this.authStatusListener.next(false);
      return throwError(() => new Error(httpError.message || 'An error occurred'));
    }
  }

  async loginUser(email: string, password: string) {
    const authData = { email, password };
    try {
      const response: any = await firstValueFrom(this.http.post('http://localhost:4000/api/user/login', authData));
      this.userId = response.userId;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      alert('Connected successfully');
      this.router.navigate(['/posts']);
      return response;
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      this.authStatusListener.next(false);
      return throwError(() => new Error(httpError.message || 'An error occurred'));
    }
  }

  logoutUser() {
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }
}
