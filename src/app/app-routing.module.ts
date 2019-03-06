import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@/_guards';
import { DashboardComponent,
  AdministrationComponent,
  HomeComponent,
  PlannerComponent,
  PlanComponent,
  RegisterPlanComponent,
  RolesComponent,
  RegisterRoleComponent,
  RoleComponent,
  LoginComponent,
  ProfileComponent,
  RegisterUserComponent,
  UserComponent,
  UsersComponent,
  StagesComponent,
  DepartmentsComponent,
  DepartmentComponent,
  AddDepartmentComponent
 } from '@/_components';

const routes: Routes = [
  //  public routes
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', data: { breadcrumb: 'login' }, component: LoginComponent},
  // private routes
  {path: 'planner', data: { breadcrumb: 'planner' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: PlannerComponent },
      {path: 'details/:id', data: { breadcrumb: 'planDetails' }, component: PlanComponent},
      {path: 'add', data: { breadcrumb: 'planAdd' }, component: RegisterPlanComponent},
      {path: 'stages', data: { breadcrumb: 'stages' }, component: StagesComponent},
    ]
  },
  {path: 'users', data: { breadcrumb: 'users' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: UsersComponent },
      {path: 'details/:id', data: { breadcrumb: 'userDetails' }, component: UserComponent},
      {path: 'register', data: { breadcrumb: 'userRegister' }, component: RegisterUserComponent},
    ]
  },
  {path: 'roles', data: { breadcrumb: 'roles' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: RolesComponent },
      {path: 'details/:id', data: { breadcrumb: 'roleDetails' }, component: RoleComponent},
      {path: 'add', data: { breadcrumb: 'roleAdd' }, component: RegisterRoleComponent},
    ]
  },
  {path: 'dashboard', data: { breadcrumb: 'dashboard' }, component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'myprofile', data: { breadcrumb: 'myprofile' }, component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'administration', data: { breadcrumb: 'administration' }, component: AdministrationComponent, canActivate: [AuthGuard]},
  {path: 'departments', data: { breadcrumb: 'departments' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: DepartmentsComponent },
      {path: 'details/:id', data: { breadcrumb: 'departmentDetails' }, component: DepartmentComponent},
      {path: 'add', data: { breadcrumb: 'departmentAdd' }, component: AddDepartmentComponent},
    ]
  }
//  {path: 'translations', component: TranslationsComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
