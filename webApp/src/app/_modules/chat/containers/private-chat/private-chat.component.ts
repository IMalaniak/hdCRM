import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';

import { Chat } from '../../_models';
import { selectUsersOnline } from '@/_modules/users/store/user.selectors';
import { OnlineUserListRequested } from '@/_modules/users/store/user.actions';

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
    this.store.dispatch(new OnlineUserListRequested());
    this.store.pipe(select(selectUsersOnline)).subscribe(users => {
      console.log(users);
    });
  }


}
