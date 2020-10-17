import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivilegeGuard } from '@/core/_guards';
import { PATHS, VIEW_PRIVILEGES, ADD_PRIVILEGES, FORMCONSTANTS } from '@/shared/constants';
import { DynamicFormResolver } from '@/shared/services';
import { AddDepartmentComponent, DepartmentComponent, DepartmentsComponent } from './components';
import { DepartmentResolver } from './services';

const routes: Routes = [
  { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.LIST },
  {
    path: PATHS.LIST,
    data: {
      breadcrumb: 'List',
      animation: 'DepartmentsListPage',
      privilege: VIEW_PRIVILEGES.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentsComponent
  },
  {
    path: PATHS.DETAILS_ID,
    data: {
      breadcrumb: 'Details',
      animation: 'DepartmentDetailsPage',
      privilege: VIEW_PRIVILEGES.DEPARTMENT,
      formName: FORMCONSTANTS.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentComponent,
    resolve: { department: DepartmentResolver, formJSON: DynamicFormResolver }
  },
  {
    path: PATHS.ADD,
    data: {
      breadcrumb: 'Add new department',
      animation: 'AddDepartmentPage',
      privilege: ADD_PRIVILEGES.DEPARTMENT,
      formName: FORMCONSTANTS.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: AddDepartmentComponent,
    resolve: { formJSON: DynamicFormResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentsRoutingModule {
  static forRoot(): ModuleWithProviders<DepartmentsRoutingModule> {
    return {
      ngModule: DepartmentsRoutingModule,
      providers: [DepartmentResolver, DynamicFormResolver]
    };
  }
}
