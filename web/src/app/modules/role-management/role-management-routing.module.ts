import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent, RoleComponent, AddRoleComponent } from './components';
import { PATHS, VIEW_PRIVILEGE, ADD_PRIVILEGE, FORM_NAME } from '@/shared/constants';
import { PrivilegeGuard } from '@/shared/guards';

const routes: Routes = [
  { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.LIST },
  {
    path: PATHS.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'RolesListPage',
      privilege: VIEW_PRIVILEGE.ROLE
    },
    canActivate: [PrivilegeGuard],
    component: RolesComponent
  },
  {
    path: PATHS.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'RoleDetailsPage',
      privilege: VIEW_PRIVILEGE.ROLE,
      formName: FORM_NAME.ROLE
    },
    canActivate: [PrivilegeGuard],
    component: RoleComponent
  },
  {
    path: PATHS.ADD,
    data: {
      breadcrumb: 'Add role',
      animation: 'AddRolePage',
      privilege: ADD_PRIVILEGE.ROLE,
      formName: FORM_NAME.ROLE
    },
    canActivate: [PrivilegeGuard],
    component: AddRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagmentRoutingModule {}
