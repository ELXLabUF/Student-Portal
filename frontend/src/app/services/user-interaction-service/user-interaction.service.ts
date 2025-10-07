import { Injectable, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root',
})
export class UserInteractionService {
    username: string = '';
    private loggedInUser: any = null; // Used to track login state changes

    constructor(
        private storage: Storage,
        public authService: AuthService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.authService.currentUser.subscribe((user) => {
            // This detects when a user logs in for a new session
            if (user && !this.loggedInUser) {
                this.clearSessionLogs();
            }
            this.loggedInUser = user;
            this.username = user?.email as string;
        });
    }

    // A private method to explicitly clear logs at the start of a session
    private clearSessionLogs(): void {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('userInteractionData');
            sessionStorage.removeItem('timeStart');
        }
    }

    // This listener automatically runs when the user closes the tab/browser
    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: Event) {
        if (isPlatformBrowser(this.platformId)) {
            // Finalize and get logs, assuming the session is ending abruptly
            const finalLogs = this.finalizeAndGetLogs('Browser/Tab Closed');
            // Check if there are any meaningful logs to save
            if (finalLogs.length > 1) {
                this.exportToCsv(finalLogs);
            }
        }
    }

    logUserInteraction(action: string, target: string, result: string) {
        if (isPlatformBrowser(this.platformId)) {
            const time = new Date();
            const userIntData = JSON.parse(
                sessionStorage.getItem('userInteractionData') || '[]'
            );
            userIntData.push({
                Action: action,
                Target: target,
                Result: result,
                Time: time.toLocaleString(),
            });
            sessionStorage.setItem(
                'userInteractionData',
                JSON.stringify(userIntData)
            );
        }
    }

    startPageTimer(pageName: string) {
        if (isPlatformBrowser(this.platformId)) {
            const timeStart = new Date();
            sessionStorage.setItem('timeStart', timeStart.toString());
            this.logUserInteraction('Visited', pageName, '');
        }
    }

    endPageTimerAndLog(pageName: string) {
        if (isPlatformBrowser(this.platformId)) {
            const timeStart = new Date(
                sessionStorage.getItem('timeStart') || new Date()
            );
            const timeEnd = new Date();
            const duration = (timeEnd.valueOf() - timeStart.valueOf()) / 1000;

            this.logUserInteraction('Left', pageName, '');
            this.logUserInteraction(
                'Time spent',
                pageName,
                `${duration} seconds`
            );
        }
    }

    finalizeAndGetLogs(exitResult: string): object[] {
        if (isPlatformBrowser(this.platformId)) {
            let pageName = '';
            switch (this.router.url) {
                case '/home':
                    pageName = "'Main Menu' page";
                    break;
                case '/create-story':
                    pageName = "'Record A Story' page";
                    break;
                case '/stories':
                    pageName = "'My Stories' page";
                    break;
                case '/about':
                    pageName = "'About' page";
                    break;
                case '/account':
                    pageName = "'Account' page";
                    break;
            }

            const timeStart = new Date(
                sessionStorage.getItem('timeStart') || new Date()
            );
            const timeEnd = new Date();
            const duration = (timeEnd.valueOf() - timeStart.valueOf()) / 1000;

            this.logUserInteraction(
                'Session Ended',
                'User left the application',
                exitResult
            );

            if (pageName) {
                this.logUserInteraction('Left', pageName, '');
                this.logUserInteraction(
                    'Time spent',
                    pageName,
                    `${duration} seconds`
                );
            }

            return JSON.parse(
                sessionStorage.getItem('userInteractionData') || '[]'
            );
        }
        return []; // Return an empty array when not in a browser
    }

    exportToCsv(rows: object[]) {
        if (!rows || !rows.length) {
            return;
        }
        const separator = ',';
        const keys = Object.keys(rows[0]);
        const csvData =
            keys.join(separator) +
            '\n' +
            rows
                .map((row: any) => {
                    return keys
                        .map((k) => {
                            let cell =
                                row[k] === null || row[k] === undefined
                                    ? ''
                                    : row[k];
                            cell =
                                cell instanceof Date
                                    ? cell.toLocaleString()
                                    : cell.toString().replace(/"/g, '""');
                            if (cell.search(/("|,|\n)/g) >= 0) {
                                cell = `"${cell}"`;
                            }
                            return cell;
                        })
                        .join(separator);
                })
                .join('\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const time = new Date()
            .toString()
            .replace(/[\s:-]/g, '_')
            .replace(/[()]/g, '');
        const fileName = `${this.username}_${time}.csv`;
        const filePath = `${this.username}/${fileName}`;
        const storageRef = ref(
            this.storage,
            `user_interaction_data_files/${filePath}`
        );
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => console.error(error.message)
        );
    }
}
