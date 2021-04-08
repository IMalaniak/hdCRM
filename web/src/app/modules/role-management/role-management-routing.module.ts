import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent, RoleComponent, AddRoleComponent } from './components';
import { PathConstants, VIEW_PRIVILEGE, ADD_PRIVILEGE, FormNameConstants } from '@/shared/constants';
import { PrivilegeGuard } from '@/shared/guards';

const routes: Routes = [
  { path: '', pathMatch: PathConstants.PATH_MATCH_FULL, redirectTo: PathConstants.LIST },
  {
    path: PathConstants.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'RolesListPage',
      privilege: VIEW_PRIVILEGE.ROLE
    },
    canActivate: [PrivilegeGuard],
    component: RolesComponent
  },
  {
    path: PathConstants.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'RoleDetailsPage',
      privilege: VIEW_PRIVILEGE.ROLE,
      formName: FormNameConstants.ROLE
    },
    canActivate: [PrivilegeGuard],
    component: RoleComponent
  },
  {
    path: PathConstants.ADD,
    data: {
      breadcrumb: 'Add role',
      animation: 'AddRolePage',
      privilege: ADD_PRIVILEGE.ROLE,
      formName: FormNameConstants.ROLE
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
