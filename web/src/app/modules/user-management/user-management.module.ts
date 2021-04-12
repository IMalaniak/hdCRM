import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@/shared/shared.module';

import { UserManagementRoutingModule } from './user-management-routing.module';
import {
  ProfileComponent,
  UserComponent,
  UsersComponent,
  UsersDialogComponent,
  InvitationDialogComponent,
  OrganismsUserDetailsComponent,
  OrganismsUserSessionsComponent,
  OrganismsUserPasswordsComponent,
  TemplatesUserProfileComponent,
  OrganismsUserPreferencesComponent,
  OrganismsUserOrganizationComponent,
  OrganismsUserIntegrationsComponent
} from './components';
import { userManagementFeatureKey, usersReducer } from './store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    UserManagementRoutingModule,
    StoreModule.forFeature(userManagementFeatureKey, usersReducer)
  ],
  declarations: [
    ProfileComponent,
    UserComponent,
    UsersComponent,
    UsersDialogComponent,
    InvitationDialogComponent,
    OrganismsUserDetailsComponent,
    OrganismsUserSessionsComponent,
    OrganismsUserPasswordsComponent,
    TemplatesUserProfileComponent,
    OrganismsUserPreferencesComponent,
    OrganismsUserOrganizationComponent,
    OrganismsUserIntegrationsComponent
  ],
  exports: [UserComponent, UsersComponent, UsersDialogComponent]
})
export class UserManagementModule {}
