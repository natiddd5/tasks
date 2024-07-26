import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadAuthData();
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  private saveAuthData(token: string) {
    localStorage.setItem('token', token);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
  }

  private loadAuthData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  async registerUser(email: string, password: string) {
    const authData = { email, password };
    try {
      const response: any = await firstValueFrom(this.http.post('http://localhost:4000/api/user/register', authData));
      alert('Registration successful, please log in');
      this.router.navigate(['/login']);
      return response;
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      if (httpError.status === 409) {
        alert('Email already exists. Please use a different email.');
      }
      return throwError(() => new Error(httpError.message || 'An error occurred'));
    }
  }

  async loginUser(email: string, password: string) {
    const authData = { email, password };
    try {
      const response: any = await firstValueFrom(this.http.post('http://localhost:4000/api/user/login', authData));
      const token = response.token;
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        this.saveAuthData(token);
        this.authStatusListener.next(true);
        alert('Connected successfully');
        this.router.navigate(['/posts']);
      }
      return response;
    } catch (error: unknown) {
      const httpError = error as HttpErrorResponse;
      this.authStatusListener.next(false);
      return throwError(() => new Error(httpError.message || 'An error occurred'));
    }
  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.clearAuthData();
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }
}
