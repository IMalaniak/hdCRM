import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { 
    AddDepartmentComponent,
    DepartmentComponent,
    DepartmentsComponent } from './_components';
import { DepartmentResolver } from './_services';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'Departments' }, component: DepartmentsComponent },
    {path: 'details/:id', data: { breadcrumb: 'Department details' }, component: DepartmentComponent, resolve: {department: DepartmentResolver}},
    {path: 'add', data: { breadcrumb: 'Add department' }, component: AddDepartmentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentsRoutingModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: DepartmentsRoutingModule,
        providers: [DepartmentResolver],
    }
  }
}