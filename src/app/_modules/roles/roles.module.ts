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

import { RoleService, PrivilegeService } from './_services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { rolesReducer } from './store/role.reducer';
import { RoleEffects } from './store/role.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RolesRoutingModule,
    StoreModule.forFeature('roles', rolesReducer),
    EffectsModule.forFeature([RoleEffects]),
    UsersModule
  ],
  declarations: [
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    RolesDialogComponent
  ],
  providers: [
    RoleService,
    PrivilegeService
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
