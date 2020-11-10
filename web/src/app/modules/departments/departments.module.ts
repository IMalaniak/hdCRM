import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DepartmentsRoutingModule } from './departments-routing.module';
import { SharedModule } from '@/shared/shared.module';

import {
  AddDepartmentComponent,
  DepartmentComponent,
  DepartmentsComponent,
  TemplatesDepartmentViewComponent
} from './components';

import { DepartmentService } from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDep from './store/department.reducer';
import { DepartmentEffects } from './store/department.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DepartmentsRoutingModule.forRoot(),
    StoreModule.forFeature(fromDep.departmentsFeatureKey, fromDep.reducer),
    EffectsModule.forFeature([DepartmentEffects])
  ],
  declarations: [AddDepartmentComponent, DepartmentComponent, DepartmentsComponent, TemplatesDepartmentViewComponent],
  providers: [DepartmentService],
  exports: [AddDepartmentComponent, DepartmentComponent, DepartmentsComponent]
})
export class DepartmentsModule {}
