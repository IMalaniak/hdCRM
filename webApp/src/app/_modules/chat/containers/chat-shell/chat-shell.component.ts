import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';

import { Chat } from '../../_models';
import * as ChatActions from '../../store/chat.actions';
import { ChatsDataSource } from '../../_services';

@Component({
  selector: 'app-chat-shell',
  templateUrl: './chat-shell.component.html',
  styleUrls: ['./chat-shell.component.css']
})
export class ChatShellComponent implements OnInit {
  @Input() dataSource: ChatsDataSource;
  @Output() createChat = new EventEmitter();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {

  }

  // chatSelected(chat: Chat): void {
  //   this.store.dispatch(new ChatActions.SetCurrentChat(chat));
  // }

  // clearChat(): void {
  //   this.store.dispatch(new ChatActions.ClearCurrentChat());
  // }

  onCreateNewChat() {
    this.createChat.emit();
  }
}
