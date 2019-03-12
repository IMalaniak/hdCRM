import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '@/_shared';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

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
  UsersComponentDialogComponent,
  StagesComponentDialogComponent,
  AddStageDialogComponent,
  StagesComponent,
  DepartmentsComponent,
  DepartmentComponent,
  AddDepartmentComponent

 } from '@/_components';

 // tags
import { ContentBoxComponent } from '@/_tags';

import { httpInterceptorsProviders } from '@/_helpers';

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
  MessageService,
  DepartmentService,
  LoaderService
 } from '@/_services';

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
    UsersComponentDialogComponent,
    StagesComponentDialogComponent,
    AddStageDialogComponent,
    StagesComponent,
    DepartmentsComponent,
    DepartmentComponent,
    AddDepartmentComponent
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
    SweetAlert2Module.forRoot(),
    FormsModule,
    HttpClientModule,
    AppMaterialModule,
    DragDropModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  entryComponents: [UsersComponentDialogComponent, RolesComponentDialogComponent, AddStageDialogComponent, StagesComponentDialogComponent],
  providers: [
    httpInterceptorsProviders,
    AuthenticationService,
    TranslationsService,
    RoleService,
    ValidateService,
    UserService,
    PlanService,
    PrivilegeService,
    StateService,
    StageService,
    MessageService,
    DepartmentService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }