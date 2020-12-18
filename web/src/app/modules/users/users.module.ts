import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@/shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
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
import { usersFeatureKey, usersReducer } from './store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    UsersRoutingModule,
    StoreModule.forFeature(usersFeatureKey, usersReducer)
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
export class UsersModule {}
