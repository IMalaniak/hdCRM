import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@/shared/shared.module';
import { RoleManagmentRoutingModule } from './role-management-routing.module';
import {
  RolesComponent,
  RoleComponent,
  AddRoleComponent,
  RolesDialogComponent,
  PrivilegesComponent,
  PrivilegesDialogComponent,
  AddPrivilegeDialogComponent,
  TemplatesRoleViewComponent
} from './components';
import { rolesFeatureKey, reducer } from './store/role.reducer';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    RoleManagmentRoutingModule,
    StoreModule.forFeature(rolesFeatureKey, reducer)
  ],
  declarations: [
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    RolesDialogComponent,
    PrivilegesComponent,
    PrivilegesDialogComponent,
    AddPrivilegeDialogComponent,
    TemplatesRoleViewComponent
  ],
  exports: [
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    RolesDialogComponent,
    PrivilegesComponent,
    PrivilegesDialogComponent,
    AddPrivilegeDialogComponent
  ]
})
export class RoleManagementModule {}
