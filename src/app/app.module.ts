import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '@/_shared';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { NgxChartsModule } from '@swimlane/ngx-charts';

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
    NgxChartsModule,
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