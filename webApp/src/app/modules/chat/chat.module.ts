import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '@/shared/shared.module';
import { ChatListComponent, ChatComponent, CreateChatDialogComponent } from './components';

import { ChatService } from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromChat from './store/chat.reducer';
import { ChatEffects } from './store/chat.effects';
import { ChatShellComponent, GroupChatComponent, PrivateChatComponent } from './containers';
import * as fromUser from '../users/store/user.reducer';
import { UserEffects } from '../users/store/user.effects';
import { UserService } from '../users';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChatRoutingModule.forRoot(),
    StoreModule.forFeature(fromChat.chatsFeatureKey, fromChat.reducer),
    StoreModule.forFeature(fromUser.usersFeatureKey, fromUser.reducer),
    EffectsModule.forFeature([ChatEffects, UserEffects])
  ],
  declarations: [ChatListComponent, ChatComponent, ChatShellComponent, GroupChatComponent, PrivateChatComponent, CreateChatDialogComponent],
  providers: [ChatService, UserService],
  exports: [ChatListComponent, ChatComponent]
})
export class ChatModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faSignInAlt    );
  }
}
