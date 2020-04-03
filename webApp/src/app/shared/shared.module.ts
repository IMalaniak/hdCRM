import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from './modules/app-material.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisV,
  faUserPlus,
  faEdit,
  faBan,
  faIdBadge,
  faUserEdit,
  faArchive,
  faUserCheck,
  faUserSlash,
  faUserTimes,
  faEnvelope,
  faPhone,
  faTimes,
  faSave,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { COMPONENTS } from './imports';

@NgModule({
  imports: [CommonModule, FormsModule, AppMaterialModule, FontAwesomeModule, AttachmentsModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS, AppMaterialModule]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faEllipsisV,
      faUserPlus,
      faEdit,
      faBan,
      faIdBadge,
      faUserEdit,
      faArchive,
      faUserCheck,
      faUserSlash,
      faUserTimes,
      faEnvelope,
      faPhone,
      faTimes,
      faSave,
      faPencilAlt
    );
  }
}
