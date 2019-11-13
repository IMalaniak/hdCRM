import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';

import { Chat } from '../../_models';
import * as ChatActions from '../../store/chat.actions';
import { getCurrentChat } from '../../store/chat.selectors';

@Component({
  selector: 'app-chat-shell',
  templateUrl: './chat-shell.component.html',
  styleUrls: ['./chat-shell.component.css']
})
export class ChatShellComponent implements OnInit {
  selectedChat$: Observable<Chat>;
  chats$: Observable<Chat[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.selectedChat$ = this.store.pipe(select(getCurrentChat));
  }

  chatSelected(chat: Chat): void {
    this.store.dispatch(new ChatActions.SetCurrentChat(chat));
  }

  clearChat(): void {
    this.store.dispatch(new ChatActions.ClearCurrentChat());
  }
}
