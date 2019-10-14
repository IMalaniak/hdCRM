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
      {path: 'planner', data: { breadcrumb: 'Planner', animation: "PlannerPage"}, loadChildren: () => import('../../_modules/planner/planner.module').then(m => m.PlannerModule)},
      {path: 'users', data: { breadcrumb: 'App Users', animation: "UsersPage"}, loadChildren: () => import('../../_modules/users/users.module').then(m => m.UsersModule) },
      {path: 'roles', data: { breadcrumb: 'App Roles', animation: "RolesPage"}, loadChildren: () => import('../../_modules/roles/roles.module').then(m => m.RolesModule) },
      {path: 'dashboard', data: { animation: "DashboardPage"}, loadChildren: () => import('../../_modules/dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'departments', data: { breadcrumb: 'Departments', animation: "DepartmentsPage"}, loadChildren: () => import('../../_modules/departments/departments.module').then(m => m.DepartmentsModule)},
      {path: 'chats', data: { breadcrumb: 'Chat', animation: "ChatsPage"}, loadChildren: () => import('../../_modules/chat/chat.module').then(m => m.ChatModule)}
    ],
    data: {animation: 'PrivateView'}
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}