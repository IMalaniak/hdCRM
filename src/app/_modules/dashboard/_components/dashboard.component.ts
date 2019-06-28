import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { takeUntil } from 'rxjs/operators';

import { StageService, Stage } from '@/_modules/planner';
import { User } from '@/_modules/users';
import { SingleChartData } from '@/core/_models';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { DepDashboardDataRequested } from '@/_modules/departments/store/department.actions';
import { selectAllDepartments } from '@/_modules/departments/store/department.selectors';
import { AllStagesRequestedFromDashboard } from '@/_modules/planner/store/plan.actions';
import { selectAllStages } from '@/_modules/planner/store/plan.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  appUser$: Observable<User>;
  editForm: boolean;
  baseUrl: string;
  departmentsChart: SingleChartData[] = [];
  planStagesChart: SingleChartData[] = [];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private stageService: StageService,
    private store: Store<AppState>
  ) { 
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.store.dispatch(new AllStagesRequestedFromDashboard);
    this.store.dispatch(new DepDashboardDataRequested());

    this.appUser$ = this.store.pipe(select(currentUser));

    this.store.pipe(select(selectAllStages), takeUntil(this.unsubscribe)).subscribe(stagesCount => {
      this.planStagesChart = stagesCount.map(stage => (new SingleChartData(stage.keyString, stage.Plans.length)));
    });

    this.store.pipe(select(selectAllDepartments), takeUntil(this.unsubscribe)).subscribe(departments => {
      this.departmentsChart = departments.map(dep => (new SingleChartData(dep.title, dep.Workers.length)));
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}