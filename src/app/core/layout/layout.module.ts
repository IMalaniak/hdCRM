import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing.module';
import { PublicViewComponent, PrivateViewComponent } from './_view-components';
import { BreadcrumbsComponent, SidebarComponent, HeaderComponent, FooterComponent } from './_components';
import { SharedModule } from '@/_shared/modules';
import { MessageModule } from '@/_modules';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    SharedModule,
    MessageModule
  ],
  declarations: [
      PublicViewComponent,
      PrivateViewComponent,
      BreadcrumbsComponent,
      SidebarComponent,
      HeaderComponent,
      FooterComponent
    ],
  exports: [
      BreadcrumbsComponent,
      SidebarComponent,
      HeaderComponent,
      FooterComponent
    ]
})
export class LayoutModule {}
