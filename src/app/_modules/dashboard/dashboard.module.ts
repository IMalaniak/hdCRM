import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './_components/dashboard.component';
import { AppMaterialModule } from '@/_shared/modules';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StageService, PlanService } from '@/_modules/planner/_services';
import { EffectsModule } from '@ngrx/effects';
import { DepartmentEffects } from '../departments/store/department.effects';
import { DepartmentService } from '../departments/_services';
import { StoreModule } from '@ngrx/store';
import { departmentsReducer } from '../departments/store/department.reducer';
import { stagesReducer } from '../planner/store/stage.reducer';
import { PlanEffects } from '../planner/store/plan.effects';

const routes: Routes = [
    {path: '', data: { breadcrumb: 'Dashboard' }, component: DashboardComponent},
];

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule.forChild(routes),
    NgxChartsModule,
    StoreModule.forFeature('departments', departmentsReducer),
    EffectsModule.forFeature([DepartmentEffects]),
    StoreModule.forFeature('stages', stagesReducer),
    EffectsModule.forFeature([PlanEffects])
  ],
  declarations: [
    DashboardComponent
    ],
  exports: [
    DashboardComponent
    ],
  providers: [StageService, PlanService, DepartmentService]
})
export class DashboardModule {}
