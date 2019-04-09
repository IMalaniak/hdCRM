import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EnsureModuleLoadedOnceGuard } from './ensureModuleLoadedOnceGuard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { httpInterceptorsProviders } from './_interceptors';

import { AuthenticationService, LoaderService, ValidateService, MediaqueryService, PrivilegeService, StateService } from '@/_shared/services';

import { LayoutModule } from './layout/layout.module';


@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      LayoutModule
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
        AuthenticationService,
        ValidateService,
        LoaderService,
        MediaqueryService,
        PrivilegeService,
        StateService
    ]
  })
  export class CoreModule extends EnsureModuleLoadedOnceGuard {    // Ensure that CoreModule is only loaded into AppModule
    // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
      super(parentModule);
    }
  }