import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-wrapper">
      <h1>Login</h1>
      <form (ngSubmit)="login()">
        <label for="email">Email:</label>
        <input type="text" id="email" [(ngModel)]="email" name="email" required />
        <label for="password">Password:</label>
        <input type="password" id="password" [(ngModel)]="password" name="password" required />
        <button type="submit">Login</button>
      </form>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //private auth = inject(Auth) // Firebase Auth instance if needed
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.authService
      .login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/stories']);
        console.log('Login successful!');
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }
}
