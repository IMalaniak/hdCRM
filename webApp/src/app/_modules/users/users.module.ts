import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@/_shared/modules';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEllipsisV, faUserPlus, faEdit, faBan, faIdBadge, faUserEdit, faArchive, faUserCheck, faUserSlash, faUserTimes, faEnvelope, faPhone, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

import {
    ProfileComponent,
    UserComponent,
    UsersComponent,
    UsersDialogComponent } from './_components';

import { UserService, StateService } from './_services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {usersReducer} from './store/user.reducer';
import { UserEffects } from './store/user.effects';
import { statesReducer } from './store/state.reducer';
import { AttachmentsModule } from '@/_shared/attachments/attachments.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AttachmentsModule,
    FontAwesomeModule,
    UsersRoutingModule.forRoot(),
    StoreModule.forFeature('users', usersReducer),
    StoreModule.forFeature('states', statesReducer),
    EffectsModule.forFeature([UserEffects])
  ],
  declarations: [
    ProfileComponent,
    UserComponent,
    UsersComponent,
    UsersDialogComponent,
  ],
  providers: [
    UserService,
    StateService
  ],
  exports: [
    ProfileComponent,
    UserComponent,
    UsersComponent,
    UsersDialogComponent
  ],
  entryComponents: [UsersDialogComponent]
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
