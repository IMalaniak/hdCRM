import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent, RegisterUserComponent, RegisterSuccessComponent } from './components';
import { AuthenticationService } from './services';
import { AuthEffects } from './store/auth.effects';
import * as fromAuth from './store/auth.reducer';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AuthRoutingModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [LoginComponent, RegisterUserComponent, RegisterSuccessComponent]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [AuthenticationService]
    };
  }
}
