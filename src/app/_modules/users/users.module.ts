import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@/_shared/modules';

import {
    ProfileComponent,
    UserComponent,
    UsersComponent,
    UsersDialogComponent } from './_components';

import { UserService } from './_services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UsersRoutingModule
  ],
  declarations: [
    ProfileComponent,
    UserComponent,
    UsersComponent,
    UsersDialogComponent,
  ],
  providers: [
    UserService
  ],
  exports: [
    ProfileComponent,
    UserComponent,
    UsersComponent,
    UsersDialogComponent
  ],
  entryComponents: [UsersDialogComponent]
})
export class UsersModule {}
