import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nav-bar',
    imports: [RouterLink, CommonModule],
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false;
    private authSubscription!: Subscription;

    constructor(
        private router: Router,
        public authService: AuthService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.authSubscription = this.authService.currentUser.subscribe(
            (user) => {
                this.isLoggedIn = !!user;
            }
        );
    }

    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }

    onLogoClick(): void {
        this.authService.currentUser.pipe(first()).subscribe((user) => {
            if (user) {
                this.router.navigate(['/home']);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    onLogoutClick(): void {
        this.authService
            .logout()
            .then(() => {
                this.router.navigate(['/login']); // Redirect to login page
            })
            .catch((error) => {
                console.error('Error logging out:', error);
                //alert('Failed to log out. Please try again.');
                this.openAlertDialog(
                    'Failed: Log Out',
                    'Failed to log out. Please try again.'
                );
            });
    }

    openAlertDialog(title: string, message: string): void {
        this.dialog.open(AlertDialogComponent, {
            width: '800px',
            data: { title: title, message: message },
        });
    }
}
