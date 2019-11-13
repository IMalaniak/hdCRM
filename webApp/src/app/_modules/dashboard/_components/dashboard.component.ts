import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { takeUntil, map, filter, take } from 'rxjs/operators';

import { User } from '@/_modules/users';
import { SingleChartData } from '@/core/_models';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { DepDashboardDataRequested } from '@/_modules/departments/store/department.actions';
import { selectAllDepartments } from '@/_modules/departments/store/department.selectors';
import { AllStagesRequestedFromDashboard } from '@/_modules/planner/store/plan.actions';
import { selectAllStages } from '@/_modules/planner/store/plan.selectors';
import { RoleDashboardDataRequested } from '@/_modules/roles/store/role.actions';
import { selectAllRoles } from '@/_modules/roles/store/role.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  appUser$: Observable<User>;
  editForm: boolean;
  departmentsChart: SingleChartData[];
  planStagesChart: SingleChartData[];
  rolesChart: SingleChartData[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(new AllStagesRequestedFromDashboard());
    this.store.dispatch(new DepDashboardDataRequested());
    this.store.dispatch(new RoleDashboardDataRequested());

    this.appUser$ = this.store.pipe(select(currentUser));

    combineLatest([
      this.store.select(selectAllStages),
      this.store.select(selectAllDepartments),
      this.store.select(selectAllRoles)
    ])
      .pipe(
        filter(([stages, departments, roles]) => stages.length > 0 && departments.length > 0 && roles.length > 0),
        map(([stagesCount, departments, roles]) => {
          this.planStagesChart = stagesCount.map(stage => new SingleChartData(stage.keyString, stage.Plans.length));
          this.departmentsChart = departments.map(dep => new SingleChartData(dep.title, dep.Workers.length));
          this.rolesChart = roles.map(role => new SingleChartData(role.keyString, role.Users.length));
        }),
        take(1),
        takeUntil(this.unsubscribe)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
