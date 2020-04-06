import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent, RegisterUserComponent } from './components';
import { AuthenticationService } from './services';
import * as fromAuth from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';
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
  faCheck,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from '@/shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AuthRoutingModule,
    FontAwesomeModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [LoginComponent, RegisterUserComponent],
  exports: [LoginComponent, RegisterUserComponent]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [AuthenticationService]
    };
  }
  constructor(library: FaIconLibrary) {
    library.addIcons(faKey, faBan, faArrowRight, faCheck, faTrashAlt, faArrowLeft, faPaperPlane, faTimes, faPlus);
  }
}
