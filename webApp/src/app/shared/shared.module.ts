import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from './modules/app-material.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { COMPONENTS } from './imports';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, AppMaterialModule, FontAwesomeModule, AttachmentsModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS, AppMaterialModule, FontAwesomeModule]
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
      faPhone
    );
  }
}
