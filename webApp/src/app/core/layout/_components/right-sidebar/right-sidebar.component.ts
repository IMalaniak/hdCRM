import { Component, Input, HostBinding, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { User } from '@/_modules/users';
import { selectUsersOnline } from '@/_modules/users/store/user.selectors';
import { OnlineUserListRequested } from '@/_modules/users/store/user.actions';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RightSidebarComponent implements OnInit {
  @Input() rightSidebarMinimized: boolean;

  @Output()
  hideRightSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostBinding('class.minimized') get minimized(): boolean {
    return this.rightSidebarMinimized;
  }

  onlineUsers$: Observable<Array<User>>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(new OnlineUserListRequested());
    this.onlineUsers$ = this.store.pipe(select(selectUsersOnline));
  }

  get sidebarTipMessage(): string {
    return this.rightSidebarMinimized ? 'Show side panel' : 'Hide side panel';
  }

  toggleRightSidebar(): void {
    this.hideRightSidebar.emit(!this.rightSidebarMinimized);
  }
}
