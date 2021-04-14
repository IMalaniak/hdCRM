import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import {
  AddDepartmentComponent,
  DepartmentComponent,
  DepartmentsComponent,
  TemplatesDepartmentViewComponent
} from './components';
import { DepartmentManagementRoutingModule } from './department-management-routing.module';
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
