import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DepartmentService } from './services';
import { departmentsFeatureKey, departmentReducer, DepartmentEffects } from './store';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(departmentsFeatureKey, departmentReducer),
    EffectsModule.forFeature([DepartmentEffects])
  ],
  providers: [DepartmentService]
})
export class DepartmentApiModule {}
