import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDepartmentComponent, DepartmentComponent, DepartmentsComponent } from './components';
import { DepartmentResolver } from './services';
import { PrivilegeGuard } from '@/core/_guards';
import { PATHS, VIEW_PRIVILEGES, ADD_PRIVILEGES, EDIT_PRIVILEGES } from '@/shared/constants';
import { EditResolver } from '@/shared/resolvers';

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
      editPrivilege: EDIT_PRIVILEGES.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentComponent,
    resolve: { department: DepartmentResolver, edit: EditResolver }
  },
  {
    path: PATHS.ADD,
    data: {
      breadcrumb: 'Add new department',
      animation: 'AddDepartmentPage',
      privilege: ADD_PRIVILEGES.DEPARTMENT
    },
    canActivate: [PrivilegeGuard],
    component: AddDepartmentComponent
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
      providers: [DepartmentResolver, EditResolver]
    };
  }
}
