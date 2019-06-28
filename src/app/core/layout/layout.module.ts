import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing.module';
import { PublicViewComponent, PrivateViewComponent } from './_view-components';
import { BreadcrumbsComponent, SidebarComponent, HeaderComponent, FooterComponent, PageNotFoundComponent, InternalServerErrorComponent } from './_components';
import { SharedModule } from '@/_shared/modules';
import { MessageModule } from '@/_modules';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { layoutReducer } from './store/layout.reducer';
import { LayoutEffects } from './store/layout.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    SharedModule,
    MessageModule,
    StoreModule.forFeature('layout', layoutReducer),
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
      InternalServerErrorComponent
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
