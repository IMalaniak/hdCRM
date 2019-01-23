import { Component, OnInit } from '@angular/core';
import { TranslationsService } from '@/_services/translations.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  translations: Object;

  constructor(
    private translationsService: TranslationsService
  ) { }

  ngOnInit() {
    this.translationsService.getTranslations([
      'DASHBOARDCOMPONENT.Header'
    ]).subscribe((translations: string[]) => {
        this.translations = translations;
    });

  }

}
