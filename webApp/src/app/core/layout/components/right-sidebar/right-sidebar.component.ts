import {
  Component,
  Input,
  HostBinding,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { User } from '@/modules/users';
import { selectUsersOnline } from '@/modules/users/store/user.selectors';
import { OnlineUserListRequested } from '@/modules/users/store/user.actions';

@Component({
  selector: 'right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightSidebarComponent implements OnInit {
  @Input() rightSidebarMinimized: boolean;

  @Input() enableDarkTheme: boolean;

  @Input() scaleFontUp: boolean;

  @Output()
  hideRightSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  enableThemeDark: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  scaleUpFont: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostBinding('class.minimized') get minimized(): boolean {
    return this.rightSidebarMinimized;
  }

  onlineUsers$: Observable<User[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(OnlineUserListRequested());
    this.onlineUsers$ = this.store.pipe(select(selectUsersOnline));
  }

  get themeTipMessage(): string {
    return this.enableDarkTheme ? 'Dark theme' : 'Light theme';
  }

  get sidebarTipMessage(): string {
    return this.rightSidebarMinimized ? 'Show side panel' : 'Hide side panel';
  }
}
