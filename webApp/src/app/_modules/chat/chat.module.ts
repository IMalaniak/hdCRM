import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '@/_shared/modules';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPlus, faEllipsisV, faInfo } from '@fortawesome/free-solid-svg-icons';

import { ChatListComponent, ChatComponent, CreateChatDialogComponent } from './_components';

import { ChatService } from './_services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { chatsReducer } from './store/chat.reducer';
import { ChatEffects } from './store/chat.effects';
import { ChatShellComponent, GroupChatComponent, PrivateChatComponent } from './containers';

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
  declarations: [ChatListComponent, ChatComponent, ChatShellComponent, GroupChatComponent, PrivateChatComponent, CreateChatDialogComponent],
  providers: [ChatService],
  exports: [ChatListComponent, ChatComponent],
  entryComponents: [CreateChatDialogComponent]
})
export class ChatModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faEllipsisV,
      faInfo,
      faPlus
    );
  }
}
