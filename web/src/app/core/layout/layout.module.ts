import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PublicViewComponent, PrivateViewComponent } from './view-containers';
import {
  BreadcrumbsComponent,
  HeaderComponent,
  FooterComponent,
  PageNotFoundComponent,
  InternalServerErrorComponent,
  LeftSidebarComponent
} from './components';
import { SharedModule } from '@/shared/shared.module';
import * as fromLayout from './store/layout.reducer';
import { LayoutEffects } from './store/layout.effects';
import * as fromUser from '@/modules/users/store/user.reducer';
import { UserEffects } from '@/modules/users/store/user.effects';
import { UserService } from '@/modules/users';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    StoreModule.forFeature(fromLayout.layoutFeatureKey, fromLayout.reducer),
    StoreModule.forFeature(fromUser.usersFeatureKey, fromUser.reducer),
    EffectsModule.forFeature([LayoutEffects, UserEffects])
  ],
  declarations: [
    PublicViewComponent,
    PrivateViewComponent,
    BreadcrumbsComponent,
    LeftSidebarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    InternalServerErrorComponent
  ],
  providers: [UserService],
  exports: [
    BreadcrumbsComponent,
    LeftSidebarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    InternalServerErrorComponent
  ]
})
export class LayoutModule {}
