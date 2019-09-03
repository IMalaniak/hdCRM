import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@/core/_guards';
import { PublicViewComponent, PrivateViewComponent } from './_view-components';
import { PageNotFoundComponent } from './_components';

const routes: Routes = [
  {
    path: '',
    component: PublicViewComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', data: { breadcrumb: 'Home' }, loadChildren: () => import('../../_modules/home/home.module').then(m => m.HomeModule) },
    ]
  },
  {
    path: '',
    component: PrivateViewComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
      {path: 'planner', loadChildren: () => import('../../_modules/planner/planner.module').then(m => m.PlannerModule)},
      {path: 'users', loadChildren: () => import('../../_modules/users/users.module').then(m => m.UsersModule) },
      {path: 'roles', loadChildren: () => import('../../_modules/roles/roles.module').then(m => m.RolesModule) },
      {path: 'dashboard', loadChildren: () => import('../../_modules/dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'departments', loadChildren: () => import('../../_modules/departments/departments.module').then(m => m.DepartmentsModule)}
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
