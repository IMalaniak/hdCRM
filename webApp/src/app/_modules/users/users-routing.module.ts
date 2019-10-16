import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    ProfileComponent,
    UserComponent,
    UsersComponent } from './_components';

import { UserResolver } from './_services';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'List', animation: 'UsersListPage' }, component: UsersComponent },
    {path: 'details/:id', data: { breadcrumb: 'Details', animation: 'UserDetailsPage' }, component: UserComponent, resolve: {user: UserResolver}},
    {path: 'myprofile', data: { breadcrumb: 'My profile', animation: 'MyProfilePage' }, component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: UsersRoutingModule,
        providers: [UserResolver],
    };
  }
}
