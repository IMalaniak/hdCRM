import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './_components/dashboard.component';
import { AppMaterialModule } from '@/_shared/modules';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DepartmentService } from '@/_modules/departments';
import { StageService } from '@/_modules/planner';

const routes: Routes = [
    {path: '', data: { breadcrumb: 'Dashboard' }, component: DashboardComponent},
];

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule.forChild(routes),
    NgxChartsModule,
  ],
  declarations: [
    DashboardComponent
    ],
  exports: [
    DashboardComponent
    ],
  providers: [DepartmentService, StageService]
})
export class DashboardModule {}
