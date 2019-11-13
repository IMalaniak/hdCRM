import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '@/_shared/modules';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisV,
  faUserPlus,
  faEdit,
  faBan,
  faAddressCard,
  faUserEdit,
  faArchive,
  faUserCheck,
  faEnvelope,
  faPhone,
  faTimes,
  faSave,
  faInfo
} from '@fortawesome/free-solid-svg-icons';

import { ChatsComponent, ChatComponent } from './_components';

import { ChatService } from './_services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { chatsReducer } from './store/chat.reducer';
import { ChatEffects } from './store/chat.effects';
import { ChatShellComponent } from './container/chat-shell/chat-shell.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    ChatRoutingModule.forRoot(),
    StoreModule.forFeature('chats', chatsReducer),
    EffectsModule.forFeature([ChatEffects])
  ],
  declarations: [ChatsComponent, ChatComponent, ChatShellComponent],
  providers: [ChatService],
  exports: [ChatsComponent, ChatComponent],
  entryComponents: []
})
export class ChatModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faEllipsisV,
      faUserPlus,
      faInfo,
      faEdit,
      faBan,
      faAddressCard,
      faUserEdit,
      faArchive,
      faUserCheck,
      faEnvelope,
      faPhone,
      faTimes,
      faSave
    );
  }
}
