import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { Chat } from '../../_models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() selectedChat: Chat;
  // @Output() delete = new EventEmitter<Chat>();
  @Output() clearCurrent = new EventEmitter<void>();

  componentActive = true;
  chat: Chat | null;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedChat) {
      const chat: any = changes.selectedChat.currentValue as Chat;
      this.displayChat(chat);
    }
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  displayChat(chat: Chat | null): void {
    this.chat = chat;
  }

  cancelEdit(): void {
    this.displayChat(this.chat);
  }
}
