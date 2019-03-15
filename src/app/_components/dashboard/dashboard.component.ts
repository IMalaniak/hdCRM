import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslationsService } from '@/_services/translations.service';
import { AuthenticationService } from '@/_services/authentication.service';
import { StageService, DepartmentService } from '@/_services';
import { User, Stage, Department, SingleChartData } from '@/_models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  translations: Object;
  appUser: User;
  editForm: boolean;
  baseUrl: string;
  departmentsChart: SingleChartData[] = [];
  planStagesChart: SingleChartData[] = [];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private translationsService: TranslationsService,
    private departmentService: DepartmentService,
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

    this.authenticationService.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.appUser = user;
    });

    this.stageService.countPlansByStage().pipe(takeUntil(this.unsubscribe)).subscribe(stagesCount => {
      this.planStagesChart = stagesCount.map(stage => (new SingleChartData(stage.keyString, stage.totalPlans)));
    });

    this.departmentService.getDepartmentList().pipe(takeUntil(this.unsubscribe)).subscribe(departments => {
      this.departmentsChart = departments.map(dep => (new SingleChartData(dep.title, dep.Workers.length)));
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}