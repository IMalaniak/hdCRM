import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TranslationsService } from '@/_services';
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

  constructor(
    public authService: AuthenticationService,
    public translationsService: TranslationsService,
    public router: Router
  ) {
    this.translationsService.translate.addLangs(['en', 'pl', 'ua', 'ru']);
    this.translationsService.translate.setDefaultLang('en');
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    if (this.authService.validToken()) {
      this.translationsService.translate.use(this.authService.currentUserValue.defaultLang);
      this.sidebarMinimized = JSON.parse(localStorage.getItem('sidebarMinimized'));
    } else {
      const browserLang = this.translationsService.translate.getBrowserLang();
      this.translationsService.translate.use(browserLang.match(/en|ua/) ? browserLang : 'en');
    }
    this.translationsService.initGlobalTranslations([
      'GLOBAL.PopUps.loggedOut',
      'GLOBAL.PopUps.serverError',
      'GLOBAL.PopUps.confirmButtonText',
      'GLOBAL.PopUps.cancelButtonText',
      'GLOBAL.PopUps.nextButtonText',
      'GLOBAL.PopUps.notAuthorized'
    ]);
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
