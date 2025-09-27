import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth } from 'firebase/auth';
import {
    Firestore,
    collection,
    getDocs,
    query,
    where,
} from '@angular/fire/firestore';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserInteractionService } from '../../services/user-interaction-service/user-interaction.service';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-account',
    imports: [FormsModule, CommonModule],
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
    private auth = getAuth();
    user = this.auth.currentUser;

    studentName: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    showPasswordForm: boolean = false;

    constructor(
        private authService: AuthService,
        private angularFirestore: Firestore,
        private userInteractionService: UserInteractionService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.userInteractionService.startPageTimer("'Account' page");

        if (this.user) {
            this.fetchStudentName(this.user.uid);
        }
    }

    ngOnDestroy(): void {
        this.userInteractionService.endPageTimerAndLog("'Account' page");
    }

    async fetchStudentName(deviceId: string): Promise<void> {
        try {
            const studentsRef = collection(
                this.angularFirestore,
                'NewStudents'
            );
            const q = query(studentsRef, where('device_id', '==', deviceId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const studentDoc = querySnapshot.docs[0];
                this.studentName = studentDoc.data()['name'] || 'Student';
            } else {
                console.warn('No student found with the given device_id.');
            }
        } catch (error) {
            console.error('Error fetching student name:', error);
        }
    }

    togglePasswordForm(): void {
        this.userInteractionService.logUserInteraction(
            'Clicked',
            this.showPasswordForm
                ? "'Cancel' button"
                : "'Change Password' button",
            this.showPasswordForm
                ? 'Hide password change form'
                : 'Show password change form'
        );

        this.showPasswordForm = !this.showPasswordForm;
        this.newPassword = '';
        this.confirmPassword = '';
    }

    updatePassword(): void {
        if (!this.newPassword || !this.confirmPassword) {
            this.openAlertDialog(
                'Warning: Incomplete Data',
                'One or more fields are incomplete. Please fill both the fields and try again.'
            );
            return;
        }

        this.userInteractionService.logUserInteraction(
            'Clicked',
            "'Update Password' button",
            'Attempt to update password'
        );

        if (this.newPassword !== this.confirmPassword) {
            this.openAlertDialog(
                'Warning: Incorrect Data',
                'The entered passwords do not match. Please try again.'
            );
            return;
        }

        this.authService
            .changePassword(this.newPassword)
            .then(() => {
                this.openAlertDialog(
                    'Success: Password Updated',
                    'The password was updated successfully!'
                );
                this.togglePasswordForm(); // Hide the form after success
            })
            .catch((error) => {
                console.error('Error updating password:', error);
                this.openAlertDialog(
                    'Failed: Password Not Updated',
                    'Failed to updated the password. Please try again.'
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
