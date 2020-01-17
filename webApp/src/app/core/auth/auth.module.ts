import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent, RegisterUserComponent } from './_components';
import { AuthenticationService } from './_services';
import * as fromAuth from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';
import { AppMaterialModule } from '@/_shared/modules';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faKey,
  faArrowRight,
  faArrowLeft,
  faTrashAlt,
  faPaperPlane,
  faBan,
  faTimes,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { SocketService } from '@/_shared/services/socket.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AuthRoutingModule,
    FontAwesomeModule,
    StoreModule.forFeature('auth', fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [LoginComponent, RegisterUserComponent],
  exports: [LoginComponent, RegisterUserComponent],
  providers: [SocketService]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [AuthenticationService]
    };
  }
  constructor(library: FaIconLibrary) {
    library.addIcons(faKey, faBan, faArrowRight, faCheck, faTrashAlt, faArrowLeft, faPaperPlane, faTimes);
  }
}
