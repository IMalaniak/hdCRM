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
      {path: 'details/:id', data: { breadcrumb: 'planDetails' }, component: PlanComponent, canActivate: [AuthGuard]},
      {path: 'add', data: { breadcrumb: 'planAdd' }, component: RegisterPlanComponent}
    ]
  },  
  {path: 'users', data: { breadcrumb: 'users' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: UsersComponent },
      {path: 'details/:id', data: { breadcrumb: 'userDetails' }, component: UserComponent, canActivate: [AuthGuard]},
      {path: 'register', data: { breadcrumb: 'userRegister' }, component: RegisterUserComponent},
    ]
  },
  {path: 'roles', data: { breadcrumb: 'roles' }, canActivate: [AuthGuard],
    children: [
      {path: '', component: RolesComponent },
      {path: 'details/:id', data: { breadcrumb: 'role/details' }, component: RoleComponent, canActivate: [AuthGuard]},
      {path: 'add', data: { breadcrumb: 'roleAdd' }, component: RegisterRoleComponent},
    ]
  },
  {path: 'dashboard', data: { breadcrumb: 'dashboard' }, component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'myprofile', data: { breadcrumb: 'myprofile' }, component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'administration', data: { breadcrumb: 'administration' }, component: AdministrationComponent, canActivate: [AuthGuard]},
//  {path: 'translations', component: TranslationsComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
