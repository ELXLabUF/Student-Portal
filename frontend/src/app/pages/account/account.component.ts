import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-account',
  imports: [FormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  private auth = getAuth();
  user = this.auth.currentUser;

  studentName: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPasswordForm: boolean = false;

  constructor(
    private authService: AuthService,
    private angularFirestore: Firestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.user) {
      this.fetchStudentName(this.user.uid);
    }
  }

  async fetchStudentName(deviceId: string): Promise<void> {
    try {
      const studentsRef = collection(this.angularFirestore, 'NewStudents');
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
      alert('Please fill out both fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.authService.changePassword(this.newPassword)
      .then(() => {
        alert('Password updated successfully!');
        this.togglePasswordForm(); // Hide the form after success
      })
      .catch((error) => {
        console.error('Error updating password:', error);
        alert('Failed to update password. Please try again.');
      });
  }

  logout(): void {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']); // Redirect to login page
      })
      .catch((error) => {
        console.error('Error logging out:', error);
        alert('Failed to log out. Please try again.');
      });
  }
}
