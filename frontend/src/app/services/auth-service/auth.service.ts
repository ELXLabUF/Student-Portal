import { Injectable } from '@angular/core';
import {
    Auth,
    authState,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private auth: Auth) {}

    async login(email: string, password: string): Promise<any> {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    // Expose authState as an observable
    get currentUser(): Observable<any> {
        return authState(this.auth);
    }

    async logout(): Promise<any> {
        return await signOut(this.auth);
    }

    async changePassword(newPassword: string): Promise<void> {
        const user = this.auth.currentUser;

        if (!user) {
            throw new Error('No user is currently logged in.');
        }

        return updatePassword(user, newPassword)
            .then(() => {
                console.log('Password updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating password:', error);
                throw error;
            });
    }
}
