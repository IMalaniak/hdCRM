import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDepartmentComponent, DepartmentComponent, DepartmentsComponent } from './components';
import { DepartmentResolver } from './services';
import { PrivilegeGuard } from '@/core/_guards';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  {
    path: 'list',
    data: {
      breadcrumb: 'List',
      animation: 'DepartmentsListPage',
      privilege: 'department-view'
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentsComponent
  },
  {
    path: 'details/:id',
    data: {
      breadcrumb: 'Details',
      animation: 'DepartmentDetailsPage',
      privilege: 'department-view'
    },
    canActivate: [PrivilegeGuard],
    component: DepartmentComponent,
    resolve: { department: DepartmentResolver }
  },
  {
    path: 'add',
    data: {
      breadcrumb: 'Add new department',
      animation: 'AddDepartmentPage',
      privilege: 'department-add'
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
      providers: [DepartmentResolver]
    };
  }
}
