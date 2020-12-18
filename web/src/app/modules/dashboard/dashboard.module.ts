import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { SharedModule } from '@/shared/shared.module';

import { StageService } from '@/modules/planner/services';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromStages from '../planner/store/stage.reducer';
import * as fromRole from '../roles/store/role.reducer';
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
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(fromRole.rolesFeatureKey, fromRole.reducer),
    StoreModule.forFeature(fromStages.stagesFeatureKey, fromStages.reducer),
    EffectsModule.forFeature([RoleEffects, StageEffects])
  ],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  providers: [StageService, RoleService]
})
export class DashboardModule {}
