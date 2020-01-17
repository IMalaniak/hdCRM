import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';

import { Chat } from '../../_models';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements OnInit {
  selectedChat$: Observable<Chat>;
  chats$: Observable<Chat[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
  }


}
