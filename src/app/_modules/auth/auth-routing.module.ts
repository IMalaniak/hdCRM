import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { 
  LoginComponent,
  RegisterUserComponent } from './_components';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'login' },
    {path: 'login', data: { breadcrumb: 'Login' }, component: LoginComponent},
    {path: 'activate-account/:token', data: { breadcrumb: 'Account activation' }, component: LoginComponent},
    {path: 'request-new-password', data: { breadcrumb: 'Request new password' }, component: LoginComponent},
    {path: 'password-reset/:token', data: { breadcrumb: 'Reset password' }, component: LoginComponent},
    {path: 'register', data: { breadcrumb: 'Register' }, component: RegisterUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}