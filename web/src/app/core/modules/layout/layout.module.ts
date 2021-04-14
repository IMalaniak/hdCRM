import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import {
  BreadcrumbsComponent,
  HeaderComponent,
  FooterComponent,
  PageNotFoundComponent,
  InternalServerErrorComponent,
  SidebarComponent,
  NotificationsComponent,
  UserDropdownComponent
} from './components';
import { LayoutEffects } from './store/layout.effects';
import * as fromLayout from './store/layout.reducer';
import { PublicViewComponent, PrivateViewComponent } from './view-containers';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    StoreModule.forFeature(fromLayout.layoutFeatureKey, fromLayout.reducer),
    EffectsModule.forFeature([LayoutEffects])
  ],
  declarations: [
    PublicViewComponent,
    PrivateViewComponent,
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    InternalServerErrorComponent,
    NotificationsComponent,
    UserDropdownComponent
  ],
  exports: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    InternalServerErrorComponent
  ]
})
export class LayoutModule {}
