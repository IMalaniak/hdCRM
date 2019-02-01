import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from '@/_shared';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent,
  AttachmentsComponent,
  BreadcrumbsComponent,
  AdministrationComponent,
  DashboardComponent,
  HomeComponent,
  MessagesComponent,
  PlannerComponent,
  PlanComponent,
  RegisterPlanComponent,
  RolesComponent,
  RolesComponentDialogComponent,
  RegisterRoleComponent,
  RoleComponent,
  SidebarComponent,
  LoginComponent,
  ProfileComponent,
  RegisterUserComponent,
  UserComponent,
  UsersComponent,
  UsersComponentDialogComponent
 } from '@/_components';

 // tags
import { ContentBoxComponent } from '@/_tags';

import { JwtInterceptor, ErrorInterceptor } from '@/_helpers';

// services
import { AuthenticationService,
  TranslationsService,
  RoleService,
  ValidateService,
  UserService,
  PlanService,
  PrivilegeService,
  StateService,
  StageService,
  MessageService } from '@/_services';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AttachmentsComponent,
    BreadcrumbsComponent,
    AdministrationComponent,
    ContentBoxComponent,
    DashboardComponent,
    HomeComponent,
    MessagesComponent,
    PlannerComponent,
    PlanComponent,
    RegisterPlanComponent,
    RolesComponent,
    RolesComponentDialogComponent,
    RegisterRoleComponent,
    RoleComponent,
    SidebarComponent,
    LoginComponent,
    ProfileComponent,
    RegisterUserComponent,
    UserComponent,
    UsersComponent,
    UsersComponentDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    FormsModule,
    HttpClientModule,
    AppMaterialModule,
    BrowserAnimationsModule
  ],
  entryComponents: [UsersComponentDialogComponent, RolesComponentDialogComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthenticationService,
    TranslationsService,
    RoleService,
    ValidateService,
    UserService,
    PlanService,
    PrivilegeService,
    StateService,
    StageService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
