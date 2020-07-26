import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Chat } from '../../models';

@Component({
  selector: 'app-chat-shell',
  templateUrl: './chat-shell.component.html'
})
export class ChatShellComponent {
  @Input() dataSource: Chat[];
  @Input() selectedChat: Chat;
  @Output() createChat = new EventEmitter();
  @Output() selected = new EventEmitter<Chat>();

  onCreateNewChat() {
    this.createChat.emit();
  }

  onChatSelected(chat: Chat) {
    this.selected.emit(chat);
  }
}
