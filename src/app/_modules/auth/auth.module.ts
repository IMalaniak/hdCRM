import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent, RegisterUserComponent } from './_components';
import { AppMaterialModule } from '@/_shared/modules';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    RegisterUserComponent
  ],
  exports: [
    LoginComponent,
    RegisterUserComponent
  ]
})
export class AuthModule {}
