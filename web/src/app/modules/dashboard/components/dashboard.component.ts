import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  currentUser,
  isPrivileged,
  lastFailedSession,
  lastSuccesfulSession
} from '@core/modules/auth/store/auth.selectors';
import { Department } from '@core/modules/department-api/shared';
import { depDashboardDataRequested, selectAllDepartments } from '@core/modules/department-api/store';
import { Stage } from '@core/modules/plan-api/shared';
import { selectAllStages, allStagesRequestedFromDashboard } from '@core/modules/plan-api/store/stage';
import { Role } from '@core/modules/role-api/shared';
import { selectAllRoles, roleDashboardDataRequested } from '@core/modules/role-api/store/role';
import { User, UserSession } from '@core/modules/user-api/shared';
import { AppState } from '@core/store';
import { LINK_TYPE, VIEW_PRIVILEGE } from '@shared/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  appUser$: Observable<User> = this.store.pipe(select(currentUser));
  lastSuccesfulSession$: Observable<UserSession> = this.store.pipe(select(lastSuccesfulSession));
  lastFailedSession$: Observable<UserSession> = this.store.pipe(select(lastFailedSession));
  rolesChartData$: Observable<Role[]> = this.store.pipe(select(selectAllRoles));
  planStagesChartData$: Observable<Stage[]> = this.store.pipe(select(selectAllStages));
  departmentsChartData$: Observable<Department[]> = this.store.pipe(select(selectAllDepartments));
  canViewRoles$: Observable<boolean> = this.store.pipe(select(isPrivileged(VIEW_PRIVILEGE.ROLE)));
  canViewPlan$: Observable<boolean> = this.store.pipe(select(isPrivileged(VIEW_PRIVILEGE.PLAN)));
  canViewDepartments$: Observable<boolean> = this.store.pipe(select(isPrivileged(VIEW_PRIVILEGE.DEPARTMENT)));

  linkTypes: typeof LINK_TYPE = LINK_TYPE;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(allStagesRequestedFromDashboard());
    this.store.dispatch(depDashboardDataRequested());
    this.store.dispatch(roleDashboardDataRequested());
  }
}
