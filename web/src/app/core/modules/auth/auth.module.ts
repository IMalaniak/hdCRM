import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '@/shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent, RegisterUserComponent, RegisterSuccessComponent } from './components';
import { AuthenticationService } from './services';
import * as fromAuth from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';

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
