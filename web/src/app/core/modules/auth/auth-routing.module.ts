import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicGuard } from '@/core/guards';
import { PathConstants } from '@/shared/constants';

import { LoginComponent, RegisterUserComponent, RegisterSuccessComponent } from './components';

const routes: Routes = [
  {
    path: PathConstants.AUTH,
    data: { breadcrumb: 'Authorization', animation: 'PublicView' },
    canActivate: [PublicGuard],
    children: [
      { path: '', pathMatch: PathConstants.PATH_MATCH_FULL, redirectTo: PathConstants.LOGIN },
      {
        path: PathConstants.LOGIN,
        data: { breadcrumb: 'Login' },
        component: LoginComponent
      },
      {
        path: PathConstants.ACTIVATE_ACCOUNT_TOKEN,
        data: { breadcrumb: 'Account activation' },
        component: LoginComponent
      },
      {
        path: PathConstants.REQUEST_NEW_PASSWORD,
        data: { breadcrumb: 'Request new password' },
        component: LoginComponent
      },
      {
        path: PathConstants.PASSWORD_RESET_TOKEN,
        data: { breadcrumb: 'Reset password' },
        component: LoginComponent
      },
      {
        path: PathConstants.REGISTER,
        data: { breadcrumb: 'Register' },
        component: RegisterUserComponent
      },
      {
        path: PathConstants.REGISTER_SUCESS,
        data: { breadcrumb: 'Successfull registration' },
        component: RegisterSuccessComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
