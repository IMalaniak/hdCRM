import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { TranslationsService } from '@/_services/translations.service';
import { AuthenticationService } from '@/_services/authentication.service';
import { User } from '@/_models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  translations: Object;
  appUser: User;
  editForm: boolean;
  baseUrl: string;

  constructor(
    private translationsService: TranslationsService,
    private authenticationService: AuthenticationService,
  ) { 
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.translationsService.getTranslations([
      'DASHBOARDCOMPONENT.Header'
    ]).subscribe((translations: string[]) => {
        this.translations = translations;
    }); 

    this.authenticationService.currentUser.subscribe(user => {
      this.appUser = user;
    });

  }
 
    onClickEdit(): void {
      this.editForm = true;
    }
}