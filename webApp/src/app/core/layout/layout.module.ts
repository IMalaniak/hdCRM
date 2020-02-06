import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing.module';
import { PublicViewComponent, PrivateViewComponent } from './_view-components';
import {
  BreadcrumbsComponent,
  HeaderComponent,
  FooterComponent,
  PageNotFoundComponent,
  InternalServerErrorComponent,
  LeftSidebarComponent,
  RightSidebarComponent
} from './_components';
import { SharedModule } from '@/_shared/modules';
import { MessageModule } from '@/_modules';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { layoutReducer } from './store/layout.reducer';
import { LayoutEffects } from './store/layout.effects';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFacebookSquare, faTwitterSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
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
  faSms,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { usersReducer } from '@/_modules/users/store/user.reducer';
import { UserEffects } from '@/_modules/users/store/user.effects';
import { UserService } from '@/_modules/users';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  swipeEasing: true,
  wheelSpeed: 0.2
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    SharedModule,
    MessageModule,
    StoreModule.forFeature('layout', layoutReducer),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([LayoutEffects, UserEffects]),
    FontAwesomeModule,
    PerfectScrollbarModule
  ],
  declarations: [
    PublicViewComponent,
    PrivateViewComponent,
    BreadcrumbsComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    InternalServerErrorComponent
  ],
  providers: [
    UserService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [
    BreadcrumbsComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
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
      faSms,
      faChevronRight
    );
  }
}
