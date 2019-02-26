import { environment } from 'environments/environment';
import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TranslationsService, PrivilegeService } from '@/_services';
import { Router, NavigationEnd } from '@angular/router';
import { User } from '@/_models';
import swal from 'sweetalert2';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mobileQuery: MediaQueryList;
  sidebarMinimized: boolean;
  baseUrl: string;
  showDebug: boolean;


  constructor(
    private media: MediaMatcher,
    private authService: AuthenticationService,
    private translationsService: TranslationsService,
    private privilegeService: PrivilegeService,
    private router: Router
  ) {
    this.showDebug = false;
    this.mobileQuery = this.media.matchMedia('(max-width: 992px)');
    this.translationsService.translate.addLangs(['en', 'pl', 'uk', 'ru']);
    this.translationsService.translate.setDefaultLang('en');
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    if (this.isValidToken) {
      this.authService.currentUser.subscribe(user => {
        this.showDebug = this.privilegeService.isPrivileged(user, 'showDebug');
      });
      this.translationsService.translate.use(this.authService.currentUserValue.defaultLang);
    } else {
      const browserLang = this.translationsService.translate.getBrowserLang();
      this.translationsService.translate.use(browserLang.match(/en|uk|pl|ru/) ? browserLang : 'en');
    }
    
    this.translationsService.initGlobalTranslations([
      'GLOBAL.PopUps.loggedOut',
      'GLOBAL.PopUps.serverError',
      'GLOBAL.PopUps.confirmButtonText',
      'GLOBAL.PopUps.cancelButtonText',
      'GLOBAL.PopUps.nextButtonText',
      'GLOBAL.PopUps.notAuthorized'
    ]);
    if (this.mobileQuery.matches) {
      this.sidebarMinimized = true;
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
        this.sidebarMinimized = true;
      });
    } else {
      this.sidebarMinimized = JSON.parse(localStorage.getItem('sidebarMinimized'));
    }

  }

  get isValidToken(): boolean {
    return this.authService.validToken();
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/home']);
    swal({
      text: this.translationsService.globalTranslations['GLOBAL.PopUps.loggedOut'],
      type: 'info',
      timer: 1000
    });

  }

  toogleSidebar() {
    this.sidebarMinimized = !this.sidebarMinimized;
    localStorage.setItem('sidebarMinimized', JSON.stringify(this.sidebarMinimized));
  }


}
