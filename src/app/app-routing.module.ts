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
  {path: 'planner', component: PlannerComponent, canActivate: [AuthGuard]},
  {path: 'plan/:id', component: PlanComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'user/:id', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'roles', component: RolesComponent, canActivate: [AuthGuard]},
  {path: 'role/:id', component: RoleComponent, canActivate: [AuthGuard]},
  {path: 'register', canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', component: RegisterUserComponent },
      { path: 'role', component: RegisterRoleComponent },
      { path: 'plan', component: RegisterPlanComponent }
    ]
  },
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'administration', component: AdministrationComponent, canActivate: [AuthGuard]},
//  {path: 'translations', component: TranslationsComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
