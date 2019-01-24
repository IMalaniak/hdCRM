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
  {path: 'login', component: LoginComponent},
  // private routes
  {path: 'planner', canActivate: [AuthGuard],
    children: [
      {path: '', component: PlannerComponent },
      {path: 'details/:id', component: PlanComponent, canActivate: [AuthGuard]},
      {path: 'add', component: RegisterPlanComponent}
    ]
  },  
  {path: 'users', canActivate: [AuthGuard],
    children: [
      {path: '', component: UsersComponent },
      {path: 'details/:id', component: UserComponent, canActivate: [AuthGuard]},
      {path: 'register', component: RegisterUserComponent},
    ]
  },
  {path: 'roles', canActivate: [AuthGuard],
    children: [
      {path: '', component: RolesComponent },
      {path: 'details/:id', component: RoleComponent, canActivate: [AuthGuard]},
      {path: 'add', component: RegisterRoleComponent},
    ]
  },
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'myprofile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'administration', component: AdministrationComponent, canActivate: [AuthGuard]},
//  {path: 'translations', component: TranslationsComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
