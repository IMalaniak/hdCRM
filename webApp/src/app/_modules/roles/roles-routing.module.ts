import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    RolesComponent,
    RoleComponent,
    AddRoleComponent, } from './_components';
import { RoleResolver } from './_services/role.resolver';
import { PrivilegeGuard } from '@/core/_guards';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'List', animation: 'RolesListPage', privilege: 'role-view' }, canActivate: [PrivilegeGuard], component: RolesComponent },
    {path: 'details/:id', data: { breadcrumb: 'Details', animation: 'RoleDetailsPage', privilege: 'role-view' }, canActivate: [PrivilegeGuard], component: RoleComponent, resolve: {role: RoleResolver}},
    {path: 'add', data: { breadcrumb: 'Add role', animation: 'AddRolePage', privilege: 'role-add' }, canActivate: [PrivilegeGuard], component: AddRoleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: RolesRoutingModule,
        providers: [RoleResolver],
    };
  }
}
