import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstants, VIEW_PRIVILEGE, ADD_PRIVILEGE, FormNameConstants } from '@/shared/constants';
import { PrivilegeGuard } from '@/shared/guards';

import { AddPlanComponent, PlanListComponent, PlanComponent, StagesComponent } from './components';

const routes: Routes = [
  { path: '', pathMatch: PathConstants.PATH_MATCH_FULL, redirectTo: PathConstants.LIST },
  {
    path: PathConstants.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'PlannerListPage',
      privilege: VIEW_PRIVILEGE.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: PlanListComponent
  },
  {
    path: PathConstants.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'PlannerDetailsPage',
      privilege: VIEW_PRIVILEGE.PLAN,
      formName: FormNameConstants.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: PlanComponent
  },
  {
    path: PathConstants.ADD,
    data: {
      breadcrumb: 'Add plan',
      animation: 'PlannerAddPage',
      privilege: ADD_PRIVILEGE.PLAN,
      formName: FormNameConstants.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: AddPlanComponent
  },
  {
    path: PathConstants.STAGES,
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
