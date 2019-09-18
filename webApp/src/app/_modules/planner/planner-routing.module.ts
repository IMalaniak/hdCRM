import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    StagesComponent } from './_components';
import { PlanResolver } from './_services';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'List' }, component: PlanListComponent },
    {path: 'details/:id', data: { breadcrumb: 'Details' }, component: PlanComponent, resolve: {plan: PlanResolver}},
    {path: 'add', data: { breadcrumb: 'Add plan' }, component: AddPlanComponent},
    {path: 'stages', data: { breadcrumb: 'Stages' }, component: StagesComponent},
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
    }
  }
}