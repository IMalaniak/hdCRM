import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent, UserComponent, UsersComponent } from './components';
import { PrivilegeGuard } from '@/core/_guards';
import { PATHS, VIEW_PRIVILEGES } from '@/shared/constants';

const routes: Routes = [
  { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.LIST },
  {
    path: PATHS.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'UsersListPage',
      privilege: VIEW_PRIVILEGES.USER
    },
    canActivate: [PrivilegeGuard],
    component: UsersComponent
  },
  {
    path: PATHS.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'UserDetailsPage',
      privilege: VIEW_PRIVILEGES.USER
    },
    canActivate: [PrivilegeGuard],
    component: UserComponent
  },
  {
    path: PATHS.MY_PROFILE,
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
      ngModule: UsersRoutingModule
    };
  }
}
