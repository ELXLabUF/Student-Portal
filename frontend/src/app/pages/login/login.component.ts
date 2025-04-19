import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-service/auth.service';
import { collection, Firestore, getDocs } from "@angular/fire/firestore";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //private auth = inject(Auth) // Firebase Auth instance if needed
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.authService
      .login(this.username, this.password)
      .then(() => {
        this.router.navigate(['/stories']);
        console.log('Login successful!');
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }
}
