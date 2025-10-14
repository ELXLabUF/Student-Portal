import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    //private auth = inject(Auth) // Firebase Auth instance if needed
    username: string = '';
    password: string = '';
    passwordVisible: boolean = false;
    errorMessage: string = '';

    constructor(private router: Router, private authService: AuthService) {}

    login() {
        this.authService
            .login(this.username, this.password)
            .then(() => {
                this.router.navigate(['/home']);
                console.log('Login successful!');
            })
            .catch((error) => {
                this.errorMessage = error.message;
            });
    }

    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }
}
