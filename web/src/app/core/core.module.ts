import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'environments/environment';

import { httpInterceptorsProviders } from './interceptors';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentApiModule } from './modules/department-api/department-api.module';
import { LayoutModule } from './modules/layout/layout.module';
import { PlanApiModule } from './modules/plan-api/plan-api.module';
import { RoleApiModule } from './modules/role-api/role-api.module';
import { UserApiModule } from './modules/user-api/user-api.module';
import { reducers, metaReducers } from './store';
import { DynamicFormEffects } from './store/dynamic-form';
import { IntegrationsEffects } from './store/integration';
import { NotificationsEffects } from './store/notifications';
import { PreferencesEffects } from './store/preferences';

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
      metaReducers
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([PreferencesEffects, IntegrationsEffects, DynamicFormEffects, NotificationsEffects]),
    StoreRouterConnectingModule.forRoot(),
    UserApiModule,
    DepartmentApiModule,
    PlanApiModule,
    RoleApiModule
  ],
  exports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule, LayoutModule],
  providers: [httpInterceptorsProviders]
})
export class CoreModule {}
