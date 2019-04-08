import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { 
    RolesComponent,
    RoleComponent,
    AddRoleComponent, } from './_components';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'Roles list' }, component: RolesComponent },
    {path: 'details/:id', data: { breadcrumb: 'Role details' }, component: RoleComponent},
    {path: 'add', data: { breadcrumb: 'Add role' }, component: AddRoleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}