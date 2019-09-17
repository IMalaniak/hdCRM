import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { ChatsDataSource } from '../../_services/';

import { Chat } from '../../_models';
import { AppState } from '@/core/reducers';

import { selectChatsLoading } from '../../store/chat.selectors';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})

export class ChatsComponent implements OnInit {
  // chats$: Observable<Chat[]>;
  dataSource: ChatsDataSource;
  loading$: Observable<boolean>;
  displayedColumns = ['id', 'messages', 'actions'];

  @Input() chats: Chat[];
  @Input() selectedChat: Chat;
  @Output() selected = new EventEmitter<Chat>();

  constructor(
    private store: Store<AppState>,
    // private router: Router
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectChatsLoading));
    this.dataSource = new ChatsDataSource(this.store);

    this.dataSource.loadChats();
  }

  chatSelected(chat: Chat): void {
    this.selected.emit(chat);
  }
}
