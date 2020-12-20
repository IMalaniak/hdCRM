import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { departmentsFeatureKey, departmentReducer, DepartmentEffects } from './store';
import { DepartmentService } from './services';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(departmentsFeatureKey, departmentReducer),
    EffectsModule.forFeature([DepartmentEffects])
  ],
  providers: [DepartmentService]
})
export class DepartmentApiModule {}
