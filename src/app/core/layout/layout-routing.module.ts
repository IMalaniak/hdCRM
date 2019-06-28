import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, PublicGuard } from '@/core/_guards';
import { PublicViewComponent, PrivateViewComponent } from './_view-components';
import { PageNotFoundComponent } from './_components';

const routes: Routes = [
  {
    path: '',
    component: PublicViewComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', data: { breadcrumb: 'Home' }, loadChildren: '../../_modules/home/home.module#HomeModule'},
      //{path: 'auth', data: { breadcrumb: 'Authorization' }, canActivate: [PublicGuard], loadChildren:  '../../_modules/auth/auth.module#AuthModule'},
    ]
  },
  {
    path: '',
    component: PrivateViewComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
      {path: 'planner', loadChildren:  '../../_modules/planner/planner.module#PlannerModule'},
      {path: 'users', loadChildren:  '../../_modules/users/users.module#UsersModule' },
      {path: 'roles', loadChildren:  '../../_modules/roles/roles.module#RolesModule' },
      {path: 'dashboard', loadChildren:  '../../_modules/dashboard/dashboard.module#DashboardModule'},
      {path: 'departments', loadChildren:  '../../_modules/departments/departments.module#DepartmentsModule'}
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
