import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPlanComponent, PlanListComponent, PlanComponent, StagesComponent } from './components';
import { PlanResolver } from './services';
import { PrivilegeGuard } from '@/core/_guards';
import { PATHS, VIEW_PRIVILEGES, ADD_PRIVILEGES } from '@/shared/constants';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: PATHS.LIST },
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
    path: `${PATHS.DETAILS}/:id`,
    data: {
      breadcrumb: 'Details',
      animation: 'PlannerDetailsPage',
      privilege: VIEW_PRIVILEGES.PLAN
    },
    canActivate: [PrivilegeGuard],
    component: PlanComponent,
    resolve: { plan: PlanResolver }
  },
  {
    path: PATHS.ADD,
    data: {
      breadcrumb: 'Add plan',
      animation: 'PlannerAddPage',
      privilege: ADD_PRIVILEGES.PLAN
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
export class PlannerRoutingModule {
  static forRoot(): ModuleWithProviders<PlannerRoutingModule> {
    return {
      ngModule: PlannerRoutingModule,
      providers: [PlanResolver]
    };
  }
}
