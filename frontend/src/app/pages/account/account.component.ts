import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-account',
    imports: [FormsModule, CommonModule],
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
    private auth = getAuth();
    user = this.auth.currentUser;

    studentName: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    showPasswordForm: boolean = false;

    constructor(
        private authService: AuthService,
        private angularFirestore: Firestore,
        //private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        if (this.user) {
            this.fetchStudentName(this.user.uid);
        }
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
        this.showPasswordForm = !this.showPasswordForm;
        this.newPassword = '';
        this.confirmPassword = '';
    }

    updatePassword(): void {
        if (!this.newPassword || !this.confirmPassword) {
            //alert('Please fill out both fields.');
            this.openAlertDialog(
                'Warning: Incomplete Data',
                'One or more fields are incomplete. Please fill both the fields and try again.'
            );
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            //alert('Passwords do not match.');
            this.openAlertDialog(
                'Warning: Incorrect Data',
                'The entered passwords do not match. Please try again.'
            );
            return;
        }

        this.authService
            .changePassword(this.newPassword)
            .then(() => {
                //alert('Password updated successfully!');
                this.openAlertDialog(
                    'Success: Password Updated',
                    'The password was updated successfully!'
                );
                this.togglePasswordForm(); // Hide the form after success
            })
            .catch((error) => {
                console.error('Error updating password:', error);
                //alert('Failed to update password. Please try again.');
                this.openAlertDialog(
                    'Failed: Password Not Updated',
                    'Failed to updated the password. Please try again.'
                );
            });
    }

    //logout(): void {
    //    this.authService
    //        .logout()
    //        .then(() => {
    //            this.router.navigate(['/login']); // Redirect to login page
    //        })
    //        .catch((error) => {
    //            console.error('Error logging out:', error);
    //            alert('Failed to log out. Please try again.');
    //        });
    //}

    openAlertDialog(title: string, message: string): void {
        this.dialog.open(AlertDialogComponent, {
            width: '800px',
            data: { title: title, message: message },
        });
    }
}
