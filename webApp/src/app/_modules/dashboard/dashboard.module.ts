import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './_components/dashboard.component';
import { AppMaterialModule } from '@/_shared/modules';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StageService, PlanService } from '@/_modules/planner/_services';
import { EffectsModule } from '@ngrx/effects';
import { DepartmentService } from '../departments/_services';
import { StoreModule } from '@ngrx/store';
import * as fromDep from '../departments/store/department.reducer';
import { stagesReducer } from '../planner/store/stage.reducer';
import { rolesReducer } from '../roles/store/role.reducer';
import { DepartmentEffects } from '../departments/store/department.effects';
import { PlanEffects } from '../planner/store/plan.effects';
import { RoleEffects } from '../roles/store/role.effects';
import { RoleService, PrivilegeService } from '../roles';
import { privilegesReducer } from '../roles/store/privilege.reducer';

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
    StoreModule.forFeature('roles', rolesReducer),
    StoreModule.forFeature('privileges', privilegesReducer),
    StoreModule.forFeature('stages', stagesReducer),
    EffectsModule.forFeature([DepartmentEffects, RoleEffects, PlanEffects])
  ],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  providers: [StageService, PlanService, DepartmentService, RoleService, PrivilegeService]
})
export class DashboardModule {}
