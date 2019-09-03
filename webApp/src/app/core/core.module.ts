import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';

import { EnsureModuleLoadedOnceGuard } from './ensureModuleLoadedOnceGuard';

import { httpInterceptorsProviders } from './_interceptors';

import { ValidateService, MediaqueryService } from '@/_shared/services';

import { AuthModule } from './auth/auth.module';
import { LayoutModule } from './layout/layout.module';

import { reducers, metaReducers } from './reducers';
import { CustomSerializer } from '@/_shared/utils';

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
      StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
      !environment.production ? StoreDevtoolsModule.instrument() : [],
      EffectsModule.forRoot([]),
      StoreRouterConnectingModule.forRoot({stateKey: 'router'})
    ],
    exports: [
      RouterModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      LayoutModule
    ],
    providers: [
        httpInterceptorsProviders,
        ValidateService,
        MediaqueryService,
        { provide: RouterStateSerializer, useClass: CustomSerializer }
    ]
  })
  export class CoreModule extends EnsureModuleLoadedOnceGuard {    // Ensure that CoreModule is only loaded into AppModule
    // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
      super(parentModule);
    }
  }