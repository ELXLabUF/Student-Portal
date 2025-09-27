import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import {
    Storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
    providedIn: 'root',
})
export class UserInteractionService {
    username: string = '';

    constructor(
        private storage: Storage,
        public authService: AuthService,
        private router: Router
    ) {
        this.authService.currentUser.subscribe((user) => {
            this.username = user?.email as string;
        });
    }

    logUserInteraction(action: string, target: string, result: string) {
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

    startPageTimer(pageName: string) {
        const timeStart = new Date();
        sessionStorage.setItem('timeStart', timeStart.toString());
        this.logUserInteraction('Visited', pageName, '');
    }

    endPageTimerAndLog(pageName: string) {
        const timeStart = new Date(
            sessionStorage.getItem('timeStart') || new Date()
        );
        const timeEnd = new Date();
        const duration = (timeEnd.valueOf() - timeStart.valueOf()) / 1000;

        this.logUserInteraction('Left', pageName, '');
        this.logUserInteraction('Time spent', pageName, `${duration} seconds`);
    }

    getFinalLogsForLogout(): object[] {
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
            'Clicked',
            "'Logout' button",
            'User logged out'
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
