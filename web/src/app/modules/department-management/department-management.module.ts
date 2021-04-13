import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@/shared/shared.module';

import { DepartmentManagementRoutingModule } from './department-management-routing.module';
import {
  AddDepartmentComponent,
  DepartmentComponent,
  DepartmentsComponent,
  TemplatesDepartmentViewComponent
} from './components';
import { departmentReducer, departmentsFeatureKey, DepartmentEffects } from './store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DepartmentManagementRoutingModule,
    StoreModule.forFeature(departmentsFeatureKey, departmentReducer),
    EffectsModule.forFeature([DepartmentEffects])
  ],
  declarations: [AddDepartmentComponent, DepartmentComponent, DepartmentsComponent, TemplatesDepartmentViewComponent],
  exports: [AddDepartmentComponent, DepartmentComponent, DepartmentsComponent]
})
export class DepartmentManagementModule {}
