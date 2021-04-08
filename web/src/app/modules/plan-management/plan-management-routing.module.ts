import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PATHS, VIEW_PRIVILEGE, ADD_PRIVILEGE, FORM_NAME } from '@/shared/constants';
import { AddPlanComponent, PlanListComponent, PlanComponent, StagesComponent } from './components';
import { PrivilegeGuard } from '@/shared/guards';

const routes: Routes = [
  { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.LIST },
  {
    path: PATHS.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'PlannerListPage',
      privilege: VIEW_PRIVILEGE.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: PlanListComponent
  },
  {
    path: PATHS.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'PlannerDetailsPage',
      privilege: VIEW_PRIVILEGE.PLAN,
      formName: FORM_NAME.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: PlanComponent
  },
  {
    path: PATHS.ADD,
    data: {
      breadcrumb: 'Add plan',
      animation: 'PlannerAddPage',
      privilege: ADD_PRIVILEGE.PLAN,
      formName: FORM_NAME.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: AddPlanComponent
  },
  {
    path: PATHS.STAGES,
    data: {
      breadcrumb: 'Stages',
      animation: 'PlannerStagesPage',
      privilege: VIEW_PRIVILEGE.STAGES
    },
    canActivate: [PrivilegeGuard],
    component: StagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanManagementRoutingModule {}
