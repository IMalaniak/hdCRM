import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    AddPlanComponent,
    PlanListComponent,
    PlanComponent,
    StagesComponent } from './_components';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'Plans list' }, component: PlanListComponent },
    {path: 'details/:id', data: { breadcrumb: 'Plan details' }, component: PlanComponent},
    {path: 'add', data: { breadcrumb: 'Add plan' }, component: AddPlanComponent},
    {path: 'stages', data: { breadcrumb: 'Stages' }, component: StagesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule {}