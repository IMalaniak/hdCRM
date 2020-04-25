import { Component, Input, HostBinding, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { User } from '@/modules/users';
import { selectUsersOnline } from '@/modules/users/store/user.selectors';
import { OnlineUserListRequested } from '@/modules/users/store/user.actions';
import { Task } from '@/modules/task-manager';
import { selectAllTasks } from '@/modules/task-manager/store/task.selectors';
import { taskListRequested } from '@/modules/task-manager/store/task.actions';

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

  onlineUsers$: Observable<User[]>;
  tasks$: Observable<Task[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(OnlineUserListRequested());
    this.store.dispatch(taskListRequested());
    this.onlineUsers$ = this.store.pipe(select(selectUsersOnline));
    this.tasks$ = this.store.pipe(select(selectAllTasks));
  }

  get sidebarTipMessage(): string {
    return this.rightSidebarMinimized ? 'Show side panel' : 'Hide side panel';
  }

  toggleRightSidebar(): void {
    this.hideRightSidebar.emit(!this.rightSidebarMinimized);
  }
}
