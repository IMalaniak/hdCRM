import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule, DefaultRouterStateSerializer } from '@ngrx/router-store';

import { httpInterceptorsProviders } from './_interceptors';

import { ValidateService, MediaqueryService, LocalStorageService, CustomSerializer } from '@/shared';

import { AuthModule } from './auth/auth.module';
import { LayoutModule } from './layout/layout.module';

import { reducers, metaReducers } from './reducers';

import { environment } from 'environments/environment';

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
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer, stateKey: 'router' })
  ],
  exports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule, LayoutModule],
  providers: [
    httpInterceptorsProviders,
    ValidateService,
    MediaqueryService,
    LocalStorageService,
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ]
})
export class CoreModule {}
