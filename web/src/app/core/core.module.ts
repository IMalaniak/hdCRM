import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { environment } from 'environments/environment';
import { httpInterceptorsProviders } from './interceptors';
import { AuthModule } from './modules/auth/auth.module';
import { LayoutModule } from './modules/layout/layout.module';
import { reducers, metaReducers } from './reducers';
import { PreferencesEffects } from './reducers/preferences/preferences.effects';
import { IntegrationsEffects } from './reducers/integration/integration.effects';
import { DynamicFormEffects } from './reducers/dynamic-form/dynamic-form.effects';
import { NotificationsEffects } from './reducers/notifications/notifications.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot(),
    LayoutModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([PreferencesEffects, IntegrationsEffects, DynamicFormEffects, NotificationsEffects]),
    StoreRouterConnectingModule.forRoot()
  ],
  exports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule, LayoutModule],
  providers: [httpInterceptorsProviders]
})
export class CoreModule {}
