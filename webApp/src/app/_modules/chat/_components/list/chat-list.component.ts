import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { Chat } from '../../_models';
import { AppState } from '@/core/reducers';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  // TODO
  @Input() dataSource: any;
  @Input() isLoading: boolean;
  displayedColumns = ['id', 'actions'];

  @Input() selectedChat: Chat;
  @Output() selected = new EventEmitter<Chat>();

  constructor(
    private store: Store<AppState> // private router: Router
  ) {}

  ngOnInit() {

  }

  chatSelected(chat: Chat): void {
    this.selected.emit(chat);
  }
}
