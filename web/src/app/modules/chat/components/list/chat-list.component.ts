import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { Chat } from '../../models';
import { pageSizeOptions, IItemsPerPage } from '@/shared/models';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getItemsPerPageState } from '@/core/reducers/preferences.selectors';
import { AppState } from '@/core/reducers';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListComponent {
  itemsPerPageState$: Observable<IItemsPerPage> = this.store$.pipe(select(getItemsPerPageState));

  // TODO @IMalaniak, @ArseniiIrod
  @Input() dataSource: any;

  @Input() isLoading: boolean;

  @Input() selectedChat: Chat;

  @Output() selected = new EventEmitter<Chat>();

  displayedColumns = ['id', 'actions'];
  pageSizeOptions: number[] = pageSizeOptions;

  constructor(private store$: Store<AppState>) {}

  chatSelected(chat: Chat): void {
    this.selected.emit(chat);
  }
}
