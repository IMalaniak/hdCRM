import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TranslationsService, PrivilegeService } from '@/_services';
import { Router } from '@angular/router';
import { User } from '@/_models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sidebarMinimized: boolean;
  baseUrl: string;
  showDebug: boolean;


  constructor(
    private authService: AuthenticationService,
    public translationsService: TranslationsService,
    private privilegeService: PrivilegeService,
    public router: Router
  ) {
    this.translationsService.translate.addLangs(['en', 'pl', 'ua', 'ru']);
    this.translationsService.translate.setDefaultLang('en');
    this.baseUrl = environment.baseUrl;
    this.showDebug = false;
  }

  ngOnInit() {    
    if (this.authService.validToken()) {
      this.translationsService.translate.use(this.authService.currentUserValue.defaultLang);
      //this.showDebug = this.privilegeService.checkUserPrivilege('showDebug');
    } else {
      const browserLang = this.translationsService.translate.getBrowserLang();
      this.translationsService.translate.use(browserLang.match(/en|ua/) ? browserLang : 'en');
    }
    this.sidebarMinimized = JSON.parse(localStorage.getItem('sidebarMinimized'));
    this.translationsService.initGlobalTranslations([
      'GLOBAL.PopUps.loggedOut',
      'GLOBAL.PopUps.serverError',
      'GLOBAL.PopUps.confirmButtonText',
      'GLOBAL.PopUps.cancelButtonText',
      'GLOBAL.PopUps.nextButtonText',
      'GLOBAL.PopUps.notAuthorized'
    ]);
    this.authService.currentUser.subscribe(user => {
      this.showDebug = this.privilegeService.isPrivileged(user, 'showDebug');
    });
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
