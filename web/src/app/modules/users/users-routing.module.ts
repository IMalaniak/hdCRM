import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent, UserComponent, UsersComponent } from './components';
import { PrivilegeGuard } from '@/core/_guards';
import { EDIT_PRIVILEGES, PATHS, VIEW_PRIVILEGES } from '@/shared/constants';
import { EditResolver } from '@/shared/resolvers';

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
      privilege: VIEW_PRIVILEGES.USER,
      editPrivilege: EDIT_PRIVILEGES.USER
    },
    canActivate: [PrivilegeGuard],
    component: UserComponent,
    resolve: { edit: EditResolver }
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
      ngModule: UsersRoutingModule,
      providers: [EditResolver]
    };
  }
}
