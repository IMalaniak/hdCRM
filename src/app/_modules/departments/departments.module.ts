import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentsRoutingModule } from './departments-routing.module';
import { SharedModule } from '@/_shared/modules';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { UsersModule } from '@/_modules/users/users.module';

import {
    AddDepartmentComponent,
    DepartmentComponent,
    DepartmentsComponent
     } from './_components';

import { DepartmentService } from './_services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DepartmentsRoutingModule,
    SweetAlert2Module,
    UsersModule
  ],
  declarations: [
    AddDepartmentComponent,
    DepartmentComponent,
    DepartmentsComponent
  ],
  providers: [
    DepartmentService
  ],
  exports: [
    AddDepartmentComponent,
    DepartmentComponent,
    DepartmentsComponent
  ]
})
export class DepartmentsModule {}
