import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent, RoleComponent, AddRoleComponent } from './components';
import { RoleResolver } from './services/role.resolver';
import { PrivilegeGuard } from '@/core/_guards';
import { PATHS, VIEW_PRIVILEGES, ADD_PRIVILEGES } from '@/shared/constants';

const routes: Routes = [
  { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.LIST },
  {
    path: PATHS.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'RolesListPage',
      privilege: VIEW_PRIVILEGES.ROLE
    },
    canActivate: [PrivilegeGuard],
    component: RolesComponent
  },
  {
    path: PATHS.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'RoleDetailsPage',
      privilege: VIEW_PRIVILEGES.ROLE
    },
    canActivate: [PrivilegeGuard],
    component: RoleComponent,
    resolve: { role: RoleResolver }
  },
  {
    path: PATHS.ADD,
    data: {
      breadcrumb: 'Add role',
      animation: 'AddRolePage',
      privilege: ADD_PRIVILEGES.ROLE
    },
    canActivate: [PrivilegeGuard],
    component: AddRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {
  static forRoot(): ModuleWithProviders<RolesRoutingModule> {
    return {
      ngModule: RolesRoutingModule,
      providers: [RoleResolver]
    };
  }
}
