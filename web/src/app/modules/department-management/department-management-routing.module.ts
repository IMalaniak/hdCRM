import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PATHS, VIEW_PRIVILEGE, ADD_PRIVILEGE, FORM_NAME } from '@/shared/constants';
import { PrivilegeGuard } from '@/shared/guards';
import { AddDepartmentComponent, DepartmentComponent, DepartmentsComponent } from './components';

const routes: Routes = [
  { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.LIST },
  {
    path: PATHS.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'DepartmentsListPage',
      privilege: VIEW_PRIVILEGE.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentsComponent
  },
  {
    path: PATHS.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'DepartmentDetailsPage',
      privilege: VIEW_PRIVILEGE.DEPARTMENT,
      formName: FORM_NAME.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentComponent
  },
  {
    path: PATHS.ADD,
    data: {
      breadcrumb: 'Add new department',
      animation: 'AddDepartmentPage',
      privilege: ADD_PRIVILEGE.DEPARTMENT,
      formName: FORM_NAME.DEPARTMENT
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
