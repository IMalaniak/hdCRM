import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@/_shared/services';
import { StageService, Stage } from '@/_modules/planner';
import { DepartmentService, Department } from '@/_modules/departments';
import { User } from '@/_modules/users';
import { SingleChartData } from '@/core/_models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  appUser: User;
  editForm: boolean;
  baseUrl: string;
  departmentsChart: SingleChartData[] = [];
  planStagesChart: SingleChartData[] = [];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private departmentService: DepartmentService,
    private authenticationService: AuthenticationService,
    private stageService: StageService
  ) { 
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
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