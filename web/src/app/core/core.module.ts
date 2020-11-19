import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule, DefaultRouterStateSerializer } from '@ngrx/router-store';
import { PreferencesEffects } from './reducers/preferences.effects';
import { reducers, metaReducers } from './reducers';
import { httpInterceptorsProviders } from './_interceptors';
import { LocalStorageService } from '@/shared/services';
import { CustomSerializer } from '@/shared/utils';
import { AuthModule } from './auth/auth.module';
import { LayoutModule } from './layout/layout.module';
import { environment } from 'environments/environment';
import { IntegrationsEffects } from './reducers/integration.effects';
import { DynamicFormEffects } from './reducers/dynamic-form/dynamic-form.effects';

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
    EffectsModule.forRoot([PreferencesEffects, IntegrationsEffects, DynamicFormEffects]),
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer, stateKey: 'router' })
  ],
  exports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule, LayoutModule],
  providers: [
    httpInterceptorsProviders,
    LocalStorageService,
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ]
})
export class CoreModule {}
