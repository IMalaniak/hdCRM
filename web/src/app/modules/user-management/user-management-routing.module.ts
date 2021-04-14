import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PathConstants, VIEW_PRIVILEGE } from '@shared/constants';
import { PrivilegeGuard } from '@shared/guards';

import { ProfileComponent, UserComponent, UsersComponent } from './components';

const routes: Routes = [
  { path: '', pathMatch: PathConstants.PATH_MATCH_FULL, redirectTo: PathConstants.LIST },
  {
    path: PathConstants.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'UsersListPage',
      privilege: VIEW_PRIVILEGE.USER
    },
    canActivate: [PrivilegeGuard],
    component: UsersComponent
  },
  {
    path: PathConstants.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'UserDetailsPage',
      privilege: VIEW_PRIVILEGE.USER
    },
    canActivate: [PrivilegeGuard],
    component: UserComponent
  },
  {
    path: PathConstants.MY_PROFILE,
    data: { breadcrumb: 'My profile', animation: 'MyProfilePage' },
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
