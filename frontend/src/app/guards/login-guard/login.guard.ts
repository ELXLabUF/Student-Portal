import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthStateResolved$.pipe(
        filter((isResolved) => isResolved),
        take(1),
        switchMap(() => authService.currentUser.pipe(take(1))),
        map((user) => {
            if (user) {
                // If the user IS logged in, block access to the login page
                // and redirect them to the home page.
                return router.createUrlTree(['/home']);
            }
            // If the user is NOT logged in, allow access to the login page.
            return true;
        })
    );
};
