import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/core/guards';
import { PublicViewComponent, PrivateViewComponent } from './core/modules/layout/view-containers';
import { PageNotFoundComponent, InternalServerErrorComponent } from './core/modules/layout/components';
import { DelayedPreloadingStrategy } from './core/strategies';
import { PATHS } from './shared/constants';

const routes: Routes = [
  {
    path: '',
    component: PublicViewComponent,
    children: [
      { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.HOME },
      {
        path: PATHS.HOME,
        data: { breadcrumb: 'Home' },
        loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule)
      }
    ]
  },
  {
    path: '',
    component: PrivateViewComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.DASHBOARD },
      {
        path: PATHS.PLANNER,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Planner', animation: 'PlannerPage', preload: true, delay: true },
        loadChildren: () => import('./modules/planner/planner.module').then((m) => m.PlannerModule)
      },
      {
        path: PATHS.USERS,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'App Users', animation: 'UsersPage', preload: true, delay: false },
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then((m) => m.UserManagementModule)
      },
      {
        path: PATHS.ROLES,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'App Roles', animation: 'RolesPage', preload: true, delay: true },
        loadChildren: () => import('./modules/roles/roles.module').then((m) => m.RolesModule)
      },
      {
        path: PATHS.DASHBOARD,
        canActivate: [AuthGuard],
        data: { animation: 'DashboardPage', preload: true, delay: true },
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: PATHS.DEPARTMENTS,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Departments',
          animation: 'DepartmentsPage',
          preload: true,
          delay: true
        },
        loadChildren: () => import('./modules/departments/departments.module').then((m) => m.DepartmentsModule)
      }
    ],
    data: { animation: 'PrivateView' }
  },
  { path: PATHS.INTERNAL_ERROR, component: InternalServerErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: DelayedPreloadingStrategy, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
