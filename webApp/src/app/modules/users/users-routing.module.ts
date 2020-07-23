import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent, UserComponent, UsersComponent } from './components';

import { UserResolver } from './services';
import { PrivilegeGuard } from '@/core/_guards';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  {
    path: 'list',
    data: {
      breadcrumb: 'List',
      animation: 'UsersListPage',
      privilege: 'user-view'
    },
    canActivate: [PrivilegeGuard],
    component: UsersComponent
  },
  {
    path: 'details/:id',
    data: {
      breadcrumb: 'Details',
      animation: 'UserDetailsPage',
      privilege: 'user-view'
    },
    canActivate: [PrivilegeGuard],
    component: UserComponent,
    resolve: { user: UserResolver }
  },
  {
    path: 'myprofile',
    data: { breadcrumb: 'My profile', animation: 'MyProfilePage' },
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
  static forRoot(): ModuleWithProviders<UsersRoutingModule> {
    return {
      ngModule: UsersRoutingModule,
      providers: [UserResolver]
    };
  }
}
