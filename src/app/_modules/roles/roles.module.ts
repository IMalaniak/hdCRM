import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from '@/_shared/modules';

import {
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    RolesDialogComponent } from './_components';

import { UsersModule } from '@/_modules/users/users.module';

import { RoleService } from './_services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RolesRoutingModule,
    UsersModule
  ],
  declarations: [
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    RolesDialogComponent
  ],
  providers: [
    RoleService
  ],
  exports: [
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    RolesDialogComponent
  ],
  entryComponents: [RolesDialogComponent]
})
export class RolesModule {}
