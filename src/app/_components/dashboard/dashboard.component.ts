import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { TranslationsService } from '@/_services/translations.service';
import { AuthenticationService } from '@/_services/authentication.service';
import { StageService } from '@/_services';
import { User, Stage } from '@/_models';

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
  stages: Stage[];

  constructor(
    private translationsService: TranslationsService,
    private authenticationService: AuthenticationService,
    private stageService: StageService
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

    this.stageService.countPlansByStage().subscribe(stage => {
      this.stages = stage;
    });
  }
}