import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DepartmentsRoutingModule } from './departments-routing.module';
import { SharedModule } from '@/shared/shared.module';

import { StoreModule } from '@ngrx/store';

import {
  AddDepartmentComponent,
  DepartmentComponent,
  DepartmentsComponent,
  TemplatesDepartmentViewComponent
} from './components';

import { DepartmentService } from './services';
import { departmentReducer, departmentsFeatureKey } from './store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DepartmentsRoutingModule,
    StoreModule.forFeature(departmentsFeatureKey, departmentReducer)
  ],
  declarations: [AddDepartmentComponent, DepartmentComponent, DepartmentsComponent, TemplatesDepartmentViewComponent],
  providers: [DepartmentService],
  exports: [AddDepartmentComponent, DepartmentComponent, DepartmentsComponent]
})
export class DepartmentsModule {}
