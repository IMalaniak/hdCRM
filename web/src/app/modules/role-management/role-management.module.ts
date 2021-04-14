import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import {
  RolesComponent,
  RoleComponent,
  AddRoleComponent,
  PrivilegesComponent,
  PrivilegesDialogComponent,
  AddPrivilegeDialogComponent,
  TemplatesRoleViewComponent
} from './components';
import { RoleManagmentRoutingModule } from './role-management-routing.module';
import { rolesFeatureKey, reducer, RoleEffects } from './store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    RoleManagmentRoutingModule,
    StoreModule.forFeature(rolesFeatureKey, reducer),
    EffectsModule.forFeature([RoleEffects])
  ],
  declarations: [
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    PrivilegesComponent,
    PrivilegesDialogComponent,
    AddPrivilegeDialogComponent,
    TemplatesRoleViewComponent
  ],
  exports: [
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    PrivilegesComponent,
    PrivilegesDialogComponent,
    AddPrivilegeDialogComponent
  ]
})
export class RoleManagementModule {}
