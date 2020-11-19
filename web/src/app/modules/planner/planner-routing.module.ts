import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivilegeGuard } from '@/core/_guards';
import { PATHS, VIEW_PRIVILEGES, ADD_PRIVILEGES, FORMCONSTANTS } from '@/shared/constants';
import { AddPlanComponent, PlanListComponent, PlanComponent, StagesComponent } from './components';

const routes: Routes = [
  { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.LIST },
  {
    path: PATHS.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'PlannerListPage',
      privilege: VIEW_PRIVILEGES.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: PlanListComponent
  },
  {
    path: PATHS.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'PlannerDetailsPage',
      privilege: VIEW_PRIVILEGES.PLAN,
      formName: FORMCONSTANTS.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: PlanComponent
  },
  {
    path: PATHS.ADD,
    data: {
      breadcrumb: 'Add plan',
      animation: 'PlannerAddPage',
      privilege: ADD_PRIVILEGES.PLAN,
      formName: FORMCONSTANTS.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: AddPlanComponent
  },
  {
    path: PATHS.STAGES,
    data: {
      breadcrumb: 'Stages',
      animation: 'PlannerStagesPage',
      privilege: VIEW_PRIVILEGES.STAGES
    },
    canActivate: [PrivilegeGuard],
    component: StagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule {}
