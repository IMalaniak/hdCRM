import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, RegisterUserComponent, RegisterSuccessComponent } from './components';
import { PublicGuard } from '@/core/_guards';
import { PATHS } from '@/shared/constants';

const routes: Routes = [
  {
    path: PATHS.AUTH,
    data: { breadcrumb: 'Authorization', animation: 'PublicView' },
    canActivate: [PublicGuard],
    children: [
      { path: '', pathMatch: PATHS.PATH_MATCH_FULL, redirectTo: PATHS.LOGIN },
      {
        path: PATHS.LOGIN,
        data: { breadcrumb: 'Login' },
        component: LoginComponent
      },
      {
        path: PATHS.ACTIVATE_ACCOUNT_TOKEN,
        data: { breadcrumb: 'Account activation' },
        component: LoginComponent
      },
      {
        path: PATHS.REQUEST_NEW_PASSWORD,
        data: { breadcrumb: 'Request new password' },
        component: LoginComponent
      },
      {
        path: PATHS.PASSWORD_RESET_TOKEN,
        data: { breadcrumb: 'Reset password' },
        component: LoginComponent
      },
      {
        path: PATHS.REGISTER,
        data: { breadcrumb: 'Register' },
        component: RegisterUserComponent
      },
      {
        path: PATHS.REGISTER_SUCESS,
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
