import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthStateResolved$.pipe(
        filter((isResolved) => isResolved),
        take(1),
        switchMap(() => authService.currentUser.pipe(take(1))),
        map((user) => {
            if (user) {
                return true; // User is logged in, allow access
            }
            // User is not logged in, redirect to the login page
            return router.createUrlTree(['/login']);
        })
    );
};
