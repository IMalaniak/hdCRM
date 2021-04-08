import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PathConstants, VIEW_PRIVILEGE, ADD_PRIVILEGE, FormNameConstants } from '@/shared/constants';
import { PrivilegeGuard } from '@/shared/guards';
import { AddDepartmentComponent, DepartmentComponent, DepartmentsComponent } from './components';

const routes: Routes = [
  { path: '', pathMatch: PathConstants.PATH_MATCH_FULL, redirectTo: PathConstants.LIST },
  {
    path: PathConstants.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'DepartmentsListPage',
      privilege: VIEW_PRIVILEGE.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentsComponent
  },
  {
    path: PathConstants.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'DepartmentDetailsPage',
      privilege: VIEW_PRIVILEGE.DEPARTMENT,
      formName: FormNameConstants.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentComponent
  },
  {
    path: PathConstants.ADD,
    data: {
      breadcrumb: 'Add new department',
      animation: 'AddDepartmentPage',
      privilege: ADD_PRIVILEGE.DEPARTMENT,
      formName: FormNameConstants.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: AddDepartmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentManagementRoutingModule {}
