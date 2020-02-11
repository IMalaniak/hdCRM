import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '@/_shared/modules';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPlus, faEllipsisV, faInfo, faSignInAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { ChatListComponent, ChatComponent, CreateChatDialogComponent } from './_components';

import { ChatService } from './_services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromChat from './store/chat.reducer';
import { ChatEffects } from './store/chat.effects';
import { ChatShellComponent, GroupChatComponent, PrivateChatComponent } from './containers';
import { usersReducer } from '../users/store/user.reducer';
import { UserEffects } from '../users/store/user.effects';
import { UserService } from '../users';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    ChatRoutingModule.forRoot(),
    StoreModule.forFeature(fromChat.chatsFeatureKey, fromChat.reducer),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([ChatEffects, UserEffects])
  ],
  declarations: [ChatListComponent, ChatComponent, ChatShellComponent, GroupChatComponent, PrivateChatComponent, CreateChatDialogComponent],
  providers: [ChatService, UserService],
  exports: [ChatListComponent, ChatComponent],
  entryComponents: [CreateChatDialogComponent]
})
export class ChatModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faEllipsisV,
      faInfo,
      faPlus,
      faSignInAlt,
      faPaperPlane
    );
  }
}
