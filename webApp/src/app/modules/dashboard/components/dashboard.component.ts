import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { takeUntil, map, filter, take } from 'rxjs/operators';

import { User } from '@/modules/users';
import { SingleChartData } from '@/shared';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { depDashboardDataRequested } from '@/modules/departments/store/department.actions';
import { selectAllDepartments } from '@/modules/departments/store/department.selectors';
import { allStagesRequestedFromDashboard } from '@/modules/planner/store/stage.actions';
import { selectAllStages } from '@/modules/planner/store/stage.selectors';
import { roleDashboardDataRequested } from '@/modules/roles/store/role.actions';
import { selectAllRoles } from '@/modules/roles/store/role.selectors';

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
    this.store.dispatch(allStagesRequestedFromDashboard());
    this.store.dispatch(depDashboardDataRequested());
    this.store.dispatch(roleDashboardDataRequested());

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
