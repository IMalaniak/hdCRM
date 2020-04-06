import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@/shared';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisV,
  faUserPlus,
  faEdit,
  faBan,
  faIdBadge,
  faUserEdit,
  faArchive,
  faUserCheck,
  faUserSlash,
  faUserTimes,
  faEnvelope,
  faPhone,
  faTimes,
  faSave
} from '@fortawesome/free-solid-svg-icons';

import {
  ProfileComponent,
  UserComponent,
  UsersComponent,
  UsersDialogComponent,
  InvitationDialogComponent
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
    FontAwesomeModule,
    UsersRoutingModule.forRoot(),
    StoreModule.forFeature(fromUser.usersFeatureKey, fromUser.reducer),
    StoreModule.forFeature(fromState.statesFeatureKey, fromState.reducer),
    EffectsModule.forFeature([UserEffects, StateEffects])
  ],
  declarations: [ProfileComponent, UserComponent, UsersComponent, UsersDialogComponent, InvitationDialogComponent],
  providers: [UserService, StateService],
  exports: [ProfileComponent, UserComponent, UsersComponent, UsersDialogComponent]
})
export class UsersModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faEllipsisV,
      faUserPlus,
      faEdit,
      faBan,
      faIdBadge,
      faUserEdit,
      faArchive,
      faUserCheck,
      faUserSlash,
      faUserTimes,
      faEnvelope,
      faPhone,
      faTimes,
      faSave
    );
  }
}
