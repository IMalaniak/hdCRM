import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  TemplatesUserProfileComponent
} from './components';

import { UserService, StateService } from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUser from './store/user.reducer';
import * as fromState from './store/state.reducer';
import { UserEffects } from './store/user.effects';
import { StateEffects } from './store/state.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UsersRoutingModule.forRoot(),
    StoreModule.forFeature(fromUser.usersFeatureKey, fromUser.reducer),
    StoreModule.forFeature(fromState.statesFeatureKey, fromState.reducer),
    EffectsModule.forFeature([UserEffects, StateEffects])
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
    TemplatesUserProfileComponent
  ],
  providers: [UserService, StateService],
  exports: [
    ProfileComponent,
    UserComponent,
    UsersComponent,
    UsersDialogComponent,
    OrganismsUserDetailsComponent,
    OrganismsUserSessionsComponent,
    OrganismsUserPasswordsComponent,
    TemplatesUserProfileComponent
  ]
})
export class UsersModule {}
