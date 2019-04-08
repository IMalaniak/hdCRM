import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, PublicGuard } from '@/core/_guards';
import { PublicViewComponent, PrivateViewComponent } from './_view-components';
import { AuthModule, HomeModule, UsersModule, RolesModule, DashboardModule, PlannerModule, DepartmentsModule } from '@/_modules';

const routes: Routes = [
  {
    path: '',
    component: PublicViewComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', data: { breadcrumb: 'Home' }, loadChildren: () => HomeModule},
      {path: 'auth', data: { breadcrumb: 'Authorization' }, canActivate: [PublicGuard], loadChildren: () => AuthModule},
    ]
  },
  {
    path: '',
    component: PrivateViewComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
      {path: 'planner', loadChildren: () => PlannerModule},
      {path: 'users', loadChildren: () => UsersModule },
      {path: 'roles', loadChildren: () => RolesModule },
      {path: 'dashboard', loadChildren: () => DashboardModule},
      {path: 'departments', loadChildren: () => DepartmentsModule}
    ]
  },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}