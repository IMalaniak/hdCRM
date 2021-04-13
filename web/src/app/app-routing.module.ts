import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@/core/guards';

import { PrivateViewComponent } from './core/modules/layout/view-containers';
import { PageNotFoundComponent, InternalServerErrorComponent } from './core/modules/layout/components';
import { DelayedPreloadingStrategy } from './core/strategies';
import { PathConstants } from './shared/constants';

const routes: Routes = [
  {
    path: '',
    component: PrivateViewComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: PathConstants.PATH_MATCH_FULL, redirectTo: PathConstants.DASHBOARD },
      {
        path: PathConstants.PLANNER,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Planner', animation: 'PlannerPage', preload: true, delay: true },
        loadChildren: () =>
          import('./modules/plan-management/plan-management.module').then((m) => m.PlanManagementModule)
      },
      {
        path: PathConstants.USERS,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'App Users', animation: 'UsersPage', preload: true, delay: false },
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then((m) => m.UserManagementModule)
      },
      {
        path: PathConstants.ROLES,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'App Roles', animation: 'RolesPage', preload: true, delay: true },
        loadChildren: () =>
          import('./modules/role-management/role-management.module').then((m) => m.RoleManagementModule)
      },
      {
        path: PathConstants.DASHBOARD,
        canActivate: [AuthGuard],
        data: { animation: 'DashboardPage', preload: true, delay: true },
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: PathConstants.DEPARTMENTS,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Departments',
          animation: 'DepartmentsPage',
          preload: true,
          delay: true
        },
        loadChildren: () =>
          import('./modules/department-management/department-management.module').then(
            (m) => m.DepartmentManagementModule
          )
      }
    ],
    data: { animation: 'PrivateView' }
  },
  { path: PathConstants.INTERNAL_ERROR, component: InternalServerErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: DelayedPreloadingStrategy, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
