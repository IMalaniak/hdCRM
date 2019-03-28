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
  {path: 'auth', data: { breadcrumb: 'Authorization' },
  children: [
    {path: '', pathMatch: 'full', redirectTo: 'login' },
    {path: 'login', data: { breadcrumb: 'Login' }, component: LoginComponent},
    {path: 'activate-account/:token', data: { breadcrumb: 'Account activation' }, component: LoginComponent},
    {path: 'request-new-password', data: { breadcrumb: 'Request new password' }, component: LoginComponent},
    {path: 'password-reset/:token', data: { breadcrumb: 'Reset password' }, component: LoginComponent},
    {path: 'register', data: { breadcrumb: 'Register' }, component: RegisterUserComponent},
  ]
},
  // private routes
  {path: 'planner', data: { breadcrumb: 'Planner' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: PlannerComponent },
      {path: 'details/:id', data: { breadcrumb: 'Plan details' }, component: PlanComponent},
      {path: 'add', data: { breadcrumb: 'Add plan' }, component: RegisterPlanComponent},
      {path: 'stages', data: { breadcrumb: 'Stages' }, component: StagesComponent},
    ]
  },
  {path: 'users', data: { breadcrumb: 'Users' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: UsersComponent },
      {path: 'details/:id', data: { breadcrumb: 'User details' }, component: UserComponent},
    ]
  },
  {path: 'roles', data: { breadcrumb: 'Roles' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: RolesComponent },
      {path: 'details/:id', data: { breadcrumb: 'Role details' }, component: RoleComponent},
      {path: 'add', data: { breadcrumb: 'Add role' }, component: RegisterRoleComponent},
    ]
  },
  {path: 'dashboard', data: { breadcrumb: 'Dashboard' }, component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'myprofile', data: { breadcrumb: 'My profile' }, component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'administration', data: { breadcrumb: 'Administration' }, component: AdministrationComponent, canActivate: [AuthGuard]},
  {path: 'departments', data: { breadcrumb: 'Departments' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: DepartmentsComponent },
      {path: 'details/:id', data: { breadcrumb: 'Department details' }, component: DepartmentComponent},
      {path: 'add', data: { breadcrumb: 'Add department' }, component: AddDepartmentComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
