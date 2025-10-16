import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthService } from './services/auth-service/auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, NavBarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'StoryLoop';
    isAuthResolved$: Observable<boolean>;

    constructor(private authService: AuthService) {
        this.isAuthResolved$ = this.authService.isAuthStateResolved$;
    }
}
