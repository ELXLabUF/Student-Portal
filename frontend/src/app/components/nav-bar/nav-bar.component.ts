import {
    Component,
    OnDestroy,
    OnInit,
    Inject,
    PLATFORM_ID,
    HostListener,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserInteractionService } from '../../services/user-interaction-service/user-interaction.service';
import { first, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nav-bar',
    imports: [CommonModule],
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false;
    showRecordStoryLink: boolean = false;
    showMyStoriesLink: boolean = false;
    isDropdownOpen: boolean = false;

    private authSubscription!: Subscription;
    private routerSubscription!: Subscription;

    constructor(
        private router: Router,
        public authService: AuthService,
        public dialog: MatDialog,
        private userInteractionService: UserInteractionService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        this.authSubscription = this.authService.currentUser.subscribe(
            (user) => {
                this.isLoggedIn = !!user;
            }
        );

        this.routerSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                const currentUrl = event.urlAfterRedirects;
                this.showRecordStoryLink = currentUrl === '/stories';
                this.showMyStoriesLink = currentUrl === '/create-story';
            });
    }

    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }

        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
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

    onRecordStoryClick(): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'Record Story' link on navbar",
            "Navigate to 'Record a Story' page"
        );
        this.router.navigate(['/create-story']);
    }

    onMyStoriesClick(): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'My Stories' link on navbar",
            "Navigate to 'My Stories' page"
        );
        this.router.navigate(['/stories']);
    }

    onAboutClick(): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'About' link on navbar",
            "Navigate to 'About' page"
        );
        this.router.navigate(['/about']);
    }

    toggleDropdown(event: Event): void {
        event.stopPropagation(); // Prevents the document click listener from closing it immediately
        this.isDropdownOpen = !this.isDropdownOpen;

        this.userInteractionService.logUserInteraction(
            'Clicked',
            'Profile dropdown icon',
            this.isDropdownOpen
                ? 'Opened profile dropdown menu'
                : 'Closed profile dropdown menu'
        );
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(): void {
        this.isDropdownOpen = false;
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
        const finalLogs = this.userInteractionService.finalizeAndGetLogs(
            'User clicked logout'
        );
        this.userInteractionService.exportToCsv(finalLogs);

        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('userInteractionData');
            sessionStorage.removeItem('timeStart');
        }

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
