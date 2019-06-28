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


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [
    LoginComponent,
    RegisterUserComponent
  ],
  exports: [
    LoginComponent,
    RegisterUserComponent
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: AuthModule,
        providers: [AuthenticationService]
    }
  }
}
