import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicViewComponent, PrivateViewComponent } from './view-containers';
import {
  BreadcrumbsComponent,
  HeaderComponent,
  FooterComponent,
  PageNotFoundComponent,
  InternalServerErrorComponent,
  LeftSidebarComponent,
  RightSidebarComponent
} from './components';
import { SharedModule } from '@/shared/shared.module';
import { MessageModule } from '@/modules/messages/messages.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromLayout from './store/layout.reducer';
import { LayoutEffects } from './store/layout.effects';

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
  faChevronRight,
  faBriefcase,
  faMinusCircle,
  faGhost,
  faCoffee,
  faGlobe,
  faUserClock,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import * as fromUser from '@/modules/users/store/user.reducer';
import { UserEffects } from '@/modules/users/store/user.effects';
import { UserService } from '@/modules/users';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TaskManagerModule } from '@/modules/task-manager/task-manager.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MessageModule,
    StoreModule.forFeature(fromLayout.layoutFeatureKey, fromLayout.reducer),
    StoreModule.forFeature(fromUser.usersFeatureKey, fromUser.reducer),
    EffectsModule.forFeature([LayoutEffects, UserEffects]),
    TaskManagerModule
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
  providers: [UserService],
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
      faChevronRight,
      faSignOutAlt,
      faBriefcase,
      faMinusCircle,
      faGhost,
      faCoffee,
      faGlobe,
      faUserClock,
      faChevronDown
    );
  }
}
