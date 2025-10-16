import { Injectable } from '@angular/core';
import {
    Auth,
    authState,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public readonly isAuthStateResolved$: Observable<boolean>;

    constructor(private auth: Auth) {
        this.isAuthStateResolved$ = authState(this.auth).pipe(
            first((user) => user !== undefined),
            map(() => true),
            shareReplay(1)
        );
    }

    async login(email: string, password: string): Promise<any> {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    // Expose authState as an observable
    get currentUser(): Observable<User | null> {
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
