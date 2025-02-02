import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { MatCard } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    MatCard,
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    NgIf,
    MatProgressSpinner
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  async onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    try {
      const response = await this.authService.loginUser(form.value.email, form.value.password);
      this.isLoading = false;
      // Handle successful login
    } catch (error) {
      this.isLoading = false;
      // Handle login error
    }
  }
}
