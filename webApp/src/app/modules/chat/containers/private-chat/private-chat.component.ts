import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';

import { Chat } from '../../models';
import { selectUsersOnline } from '@/modules/users/store/user.selectors';
import { OnlineUserListRequested } from '@/modules/users/store/user.actions';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivateChatComponent implements OnInit {
  selectedChat$: Observable<Chat>;
  chats$: Observable<Chat[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(OnlineUserListRequested());
    this.store.pipe(select(selectUsersOnline)).subscribe((users) => {
      console.log(users);
    });
  }
}
