import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    StagesComponent } from './_components';
import { PlanResolver } from './_services';
import { PrivilegeGuard } from '@/core/_guards';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'List', animation: 'PlannerListPage', privilege: 'plan-view' }, canActivate: [PrivilegeGuard], component: PlanListComponent },
    {path: 'details/:id', data: { breadcrumb: 'Details', animation: 'PlannerDetailsPage', privilege: 'plan-view' }, canActivate: [PrivilegeGuard], component: PlanComponent, resolve: {plan: PlanResolver}},
    {path: 'add', data: { breadcrumb: 'Add plan', animation: 'PlannerAddPage', privilege: 'plan-add' }, canActivate: [PrivilegeGuard], component: AddPlanComponent},
    {path: 'stages', data: { breadcrumb: 'Stages', animation: 'PlannerStagesPage', privilege: 'stage-view' }, canActivate: [PrivilegeGuard], component: StagesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: PlannerRoutingModule,
        providers: [PlanResolver],
    };
  }
}
