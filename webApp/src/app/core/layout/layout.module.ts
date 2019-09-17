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

import { FontAwesomeModule, FaIconLibrary  } from '@fortawesome/angular-fontawesome';
import { faFacebookSquare, faTwitterSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faHome, faThLarge, faUser, faUsers, faUserTag, faListAlt, faBuilding, faSignOutAlt, faBars, faArrowLeft, faSearch, faQuestion, faCog, faTimes, faSms } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    SharedModule,
    MessageModule,
    StoreModule.forFeature('layout', layoutReducer),
    EffectsModule.forFeature([LayoutEffects]),
    FontAwesomeModule
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
export class LayoutModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faFacebookSquare,
      faTwitterSquare,
      faInstagram,
      faHome,
      faThLarge,
      faUser,
      faUsers,
      faUserTag,
      faListAlt,
      faBuilding,
      faSignOutAlt,
      faBars,
      faArrowLeft,
      faSearch,
      faQuestion,
      faCog,
      faTimes,
      faSms
    );
  }
}
