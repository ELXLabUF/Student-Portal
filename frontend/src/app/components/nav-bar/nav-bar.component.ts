import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserInteractionService } from '../../services/user-interaction-service/user-interaction.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nav-bar',
    imports: [CommonModule],
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false;
    private authSubscription!: Subscription;

    constructor(
        private router: Router,
        public authService: AuthService,
        public dialog: MatDialog,
        private userInteractionService: UserInteractionService
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
                this.userInteractionService.logUserInteraction(
                    'Clicked',
                    'Logo on navbar',
                    "Navigate to 'Main Menu' page"
                );
                this.router.navigate(['/home']);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    onAboutClick(): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'About' link on navbar",
            "Navigate to 'About' page"
        );
        this.router.navigate(['/about']);
    }

    onAccountClick(): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'Account' link on navbar",
            "Navigate to 'Account' page"
        );
        this.router.navigate(['/account']);
    }

    async onLogoutClick(): Promise<void> {
        const finalLogs = this.userInteractionService.getFinalLogsForLogout();
        this.userInteractionService.exportToCsv(finalLogs);

        sessionStorage.removeItem('userInteractionData');
        sessionStorage.removeItem('timeStart');

        try {
            await this.authService.logout();
            this.router.navigate(['/login']); // Redirect to login page
        } catch (error) {
            console.error('Error logging out:', error);
            this.openAlertDialog(
                'Failed: Log Out',
                'Failed to log out. Please try again.'
            );
        }
    }

    openAlertDialog(title: string, message: string): void {
        this.dialog.open(AlertDialogComponent, {
            width: '800px',
            data: { title: title, message: message },
        });
    }
}
