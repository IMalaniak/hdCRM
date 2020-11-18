import { Component, Input, HostBinding, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { User } from '@/modules/users';
import { selectUsersOnline } from '@/modules/users/store/user.selectors';
import { OnlineUserListRequested } from '@/modules/users/store/user.actions';
import { CONSTANTS } from '@/shared/constants';

@Component({
  selector: 'right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightSidebarComponent implements OnInit {
  onlineUsers$: Observable<User[]> = this.store.pipe(select(selectUsersOnline));

  @Input() rightSidebarMinimized: boolean;
  @Input() scaleFontUp: boolean;

  @Output()
  hideRightSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  scaleUpFont: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostBinding('class.minimized') get minimized(): boolean {
    return this.rightSidebarMinimized;
  }

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(OnlineUserListRequested());
  }

  sidebarTipMessage(): string {
    return this.rightSidebarMinimized ? CONSTANTS.TEXTS_SHOW_SIDEBAR : CONSTANTS.TEXTS_HIDE_SIDEBAR;
  }
}
