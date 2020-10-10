import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@/shared/shared.module';

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

import { UserService } from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUser from './store/user.reducer';
import { UserEffects } from './store/user.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    UsersRoutingModule.forRoot(),
    StoreModule.forFeature(fromUser.usersFeatureKey, fromUser.reducer),
    EffectsModule.forFeature([UserEffects])
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
  providers: [UserService],
  exports: [UserComponent, UsersComponent, UsersDialogComponent]
})
export class UsersModule {}
