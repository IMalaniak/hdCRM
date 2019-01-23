import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService, TranslationsService } from '@/_services';
import swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private translationsService: TranslationsService,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        const validToken = this.authenticationService.validToken();
        if (currentUser && validToken) {
            // logged in so return true
            return true;
        }
        swal({
            text: this.translationsService.globalTranslations['GLOBAL.PopUps.notAuthorized'],
            type: 'error',
            timer: 1500
        });
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
