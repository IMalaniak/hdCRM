import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { AppMaterialModule } from '@/shared/modules';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StageService } from '@/modules/planner/services';
import { EffectsModule } from '@ngrx/effects';
import { DepartmentService } from '../departments/services';
import { StoreModule } from '@ngrx/store';
import * as fromDep from '../departments/store/department.reducer';
import * as fromStages from '../planner/store/stage.reducer';
import * as fromRole from '../roles/store/role.reducer';
import { DepartmentEffects } from '../departments/store/department.effects';
import { RoleEffects } from '../roles/store/role.effects';
import { RoleService } from '../roles';
import { StageEffects } from '../planner/store/stage.effects';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Dashboard' },
    component: DashboardComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule.forChild(routes),
    NgxChartsModule,
    StoreModule.forFeature(fromDep.departmentsFeatureKey, fromDep.reducer),
    StoreModule.forFeature(fromRole.rolesFeatureKey, fromRole.reducer),
    StoreModule.forFeature(fromStages.stagesFeatureKey, fromStages.reducer),
    EffectsModule.forFeature([DepartmentEffects, RoleEffects, StageEffects])
  ],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  providers: [StageService, DepartmentService, RoleService]
})
export class DashboardModule {}
