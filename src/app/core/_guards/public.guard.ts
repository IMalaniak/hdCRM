import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AuthenticationService } from '@/_shared/services';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        const validToken = this.authenticationService.validToken();
        if (currentUser && validToken) {
            // user session is valid, so redirect to dashboard
            this.router.navigate(['/dashboard']);
            return false;
        }

        // not logged in so redirect to login page with the return url
        return true;
    }
}
