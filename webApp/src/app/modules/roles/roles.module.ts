import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from '@/shared';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisV,
  faInfo,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import {
  RolesComponent,
  RoleComponent,
  AddRoleComponent,
  RolesDialogComponent,
  PrivilegesComponent,
  PrivilegesDialogComponent,
  AddPrivilegeDialogComponent
} from './components';

import { UsersModule } from '@/modules/users/users.module';

import { RoleService, PrivilegeService } from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromRole from './store/role.reducer';
import { RoleEffects } from './store/role.effects';
import * as fromPrivilege from './store/privilege.reducer';
import { PrivilegeEffects } from './store/privilege.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    RolesRoutingModule.forRoot(),
    StoreModule.forFeature(fromRole.rolesFeatureKey, fromRole.reducer),
    StoreModule.forFeature(fromPrivilege.privilegesFeatureKey, fromPrivilege.reducer),
    EffectsModule.forFeature([RoleEffects, PrivilegeEffects]),
    UsersModule
  ],
  declarations: [
    RolesComponent,
    RoleComponent,
    AddRoleComponent,
    RolesDialogComponent,
    PrivilegesComponent,
    PrivilegesDialogComponent,
    AddPrivilegeDialogComponent
  ],
  providers: [RoleService, PrivilegeService],
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
export class RolesModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faEllipsisV, faInfo, faEdit, faTrash);
  }
}
