import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';

import { Chat } from '../../models';
import { SocketService, SocketEvent } from '@/shared';
import {
  getGroupChatSocketInited,
  selectChatsLoading,
  getCurrentGChat,
  selectAllGChats
} from '../../store/chat.selectors';
import { map, takeUntil } from 'rxjs/operators';
import * as groupChatActions from '../../store/group-chat.actions';
import { MatDialog } from '@angular/material/dialog';
import { CreateChatDialogComponent } from '../../components';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupChatComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  selectedChat$: Observable<Chat>;
  chatList$: Observable<Chat[]>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: Store<AppState>, private scktService: SocketService, private dialog: MatDialog) {}

  ngOnInit() {
    this.store
      .pipe(
        select(getGroupChatSocketInited),
        map((groupChatSocketInited) => {
          if (!groupChatSocketInited) {
            this.store.dispatch(groupChatActions.initGroupChatSocket());
          }
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe();

    this.store.dispatch(groupChatActions.groupChatListRequested());

    this.chatList$ = this.store.pipe(takeUntil(this.unsubscribe), select(selectAllGChats));

    this.loading$ = this.store.pipe(select(selectChatsLoading), takeUntil(this.unsubscribe));

    this.selectedChat$ = this.store.pipe(select(getCurrentGChat), takeUntil(this.unsubscribe));

    this.scktService.onEvent(SocketEvent.NEWCHATGROUP).subscribe((chat: Chat) => {
      this.store.dispatch(groupChatActions.newGroupChatAdded({ chat }));
    });
  }

  createGroupChatDialog(): void {
    const dialogRef = this.dialog.open(CreateChatDialogComponent, {
      data: {
        header: 'Create Group Chat',
        title: new FormControl('', [Validators.required, Validators.minLength(4)])
      }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result) => {
        if (result) {
          this.scktService.emit(SocketEvent.NEWCHATGROUP, result);
        }
      });
  }

  chatSelected(chat: Chat): void {
    this.store.dispatch(groupChatActions.setCurrentGroupChat({ chat }));
  }

  // clearChat(): void {
  //   this.store.dispatch(new ChatActions.ClearCurrentChat());
  // }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
