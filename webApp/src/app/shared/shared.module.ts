import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from './modules/app-material.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  faEllipsisV,
  faUserPlus,
  faEdit,
  faBan,
  faEnvelope,
  faTimes,
  faSave,
  faPencilAlt,
  faInfo,
  faPlus,
  faTrash,
  faKey,
  faArrowRight,
  faArrowLeft,
  faTrashAlt,
  faCheck,
  faPaperPlane,
  faIdBadge,
  faUserEdit,
  faArchive,
  faUserCheck,
  faUserSlash,
  faUserTimes,
  faPhone,
  faUser,
  faToggleOn,
  faDesktop,
  faMobileAlt,
  faTabletAlt,
  faExpandAlt,
  faCompressAlt
} from '@fortawesome/free-solid-svg-icons';
import { faFontAwesomeFlag } from '@fortawesome/free-brands-svg-icons';
import { COMPONENTS, PIPES } from './imports';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AppMaterialModule,
    FontAwesomeModule,
    AttachmentsModule,
    NgxChartsModule,
    ReactiveFormsModule
  ],
  declarations: [...COMPONENTS, ...PIPES],
  exports: [
    ...COMPONENTS,
    ...PIPES,
    AppMaterialModule,
    FontAwesomeModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [...PIPES]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faEllipsisV,
      faUserPlus,
      faEdit,
      faBan,
      faEnvelope,
      faTimes,
      faSave,
      faPencilAlt,
      faInfo,
      faPlus,
      faTrash,
      faKey,
      faArrowRight,
      faArrowLeft,
      faTrashAlt,
      faCheck,
      faPaperPlane,
      // user icons need to preload for dialog...todo check
      faIdBadge,
      faUserEdit,
      faArchive,
      faUserCheck,
      faUserSlash,
      faUserTimes,
      faPhone,
      faFontAwesomeFlag,
      faCompressAlt,
      faExpandAlt,
      faUser,
      faToggleOn,
      faDesktop,
      faTabletAlt,
      faMobileAlt
    );
  }
}
