import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '@/core/_guards';
import { PublicViewComponent, PrivateViewComponent } from './core/layout/view-containers';
import { PageNotFoundComponent, InternalServerErrorComponent } from './core/layout/components';

const routes: Routes = [
  {
    path: '',
    component: PublicViewComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
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
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'planner',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Planner', animation: 'PlannerPage' },
        loadChildren: () => import('./modules/planner/planner.module').then((m) => m.PlannerModule)
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'App Users', animation: 'UsersPage' },
        loadChildren: () => import('./modules/users/users.module').then((m) => m.UsersModule)
      },
      {
        path: 'roles',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'App Roles', animation: 'RolesPage' },
        loadChildren: () => import('./modules/roles/roles.module').then((m) => m.RolesModule)
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        data: { animation: 'DashboardPage' },
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'departments',
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Departments',
          animation: 'DepartmentsPage'
        },
        loadChildren: () => import('./modules/departments/departments.module').then((m) => m.DepartmentsModule)
      }
      // {
      //   path: 'chats',
      //   canActivate: [AuthGuard],
      //   data: { breadcrumb: 'Chat', animation: 'ChatsPage' },
      //   loadChildren: () => import('./modules/chat/chat.module').then((m) => m.ChatModule)
      // }
    ],
    data: { animation: 'PrivateView' }
  },
  { path: 'server-error', component: InternalServerErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
