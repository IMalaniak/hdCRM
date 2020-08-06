import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { depDashboardDataRequested } from '@/modules/departments/store/department.actions';
import { selectAllDepartments } from '@/modules/departments/store/department.selectors';
import { allStagesRequestedFromDashboard } from '@/modules/planner/store/stage.actions';
import { selectAllStages } from '@/modules/planner/store/stage.selectors';
import { roleDashboardDataRequested } from '@/modules/roles/store/role.actions';
import { selectAllRoles } from '@/modules/roles/store/role.selectors';
import { Role } from '@/modules/roles';
import { Stage } from '@/modules/planner';
import { Department } from '@/modules/departments';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  appUser$: Observable<User>;
  departmentsChartData$: Observable<Department[]>;
  planStagesChartData$: Observable<Stage[]>;
  rolesChartData$: Observable<Role[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(allStagesRequestedFromDashboard());
    this.store.dispatch(depDashboardDataRequested());
    this.store.dispatch(roleDashboardDataRequested());

    this.appUser$ = this.store.pipe(select(currentUser));
    this.planStagesChartData$ = this.store.pipe(select(selectAllStages));
    this.departmentsChartData$ = this.store.pipe(select(selectAllDepartments));
    this.rolesChartData$ = this.store.pipe(select(selectAllRoles));
  }
}
