import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentsRoutingModule } from './departments-routing.module';
import { SharedModule } from '@/shared';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { UsersModule } from '@/modules/users/users.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisV,
  faInfo,
  faEdit,
  faPlus,
  faSave,
  faTimes,
  faTrash,
  faUserPlus,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

import { AddDepartmentComponent, DepartmentComponent, DepartmentsComponent } from './components';

import { DepartmentService } from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDep from './store/department.reducer';
import { DepartmentEffects } from './store/department.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DepartmentsRoutingModule.forRoot(),
    SweetAlert2Module,
    UsersModule,
    StoreModule.forFeature(fromDep.departmentsFeatureKey, fromDep.reducer),
    EffectsModule.forFeature([DepartmentEffects]),
    FontAwesomeModule
  ],
  declarations: [AddDepartmentComponent, DepartmentComponent, DepartmentsComponent],
  providers: [DepartmentService],
  exports: [AddDepartmentComponent, DepartmentComponent, DepartmentsComponent]
})
export class DepartmentsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faEllipsisV, faInfo, faEdit, faPlus, faSave, faTimes, faTrash, faUserPlus, faPaperPlane);
  }
}
