import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { 
    ProfileComponent,
    UserComponent,
    UsersComponent } from './_components';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'Users list' }, component: UsersComponent },
    {path: 'details/:id', data: { breadcrumb: 'User details' }, component: UserComponent},
    {path: 'myprofile', data: { breadcrumb: 'My profile' }, component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}