import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Chat } from '../../_models';

@Component({
  selector: 'app-chat-shell',
  templateUrl: './chat-shell.component.html',
  styleUrls: ['./chat-shell.component.css']
})
export class ChatShellComponent implements OnInit {
  @Input() dataSource: Chat[];
  @Input() selectedChat: Chat;
  @Output() createChat = new EventEmitter();
  @Output() selected = new EventEmitter<Chat>();

  constructor() {}

  ngOnInit() {

  }

  onCreateNewChat() {
    this.createChat.emit();
  }

  onChatSelected(chat: Chat) {
    this.selected.emit(chat);
  }
}
