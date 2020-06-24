import { Component, Input, HostBinding, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { User } from '@/modules/users';
import { selectUsersOnline } from '@/modules/users/store/user.selectors';
import { OnlineUserListRequested } from '@/modules/users/store/user.actions';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RightSidebarComponent implements OnInit {
  @Input() rightSidebarMinimized: boolean;

  @Input() themeModeSwitched: boolean;

  @Input() fontResized: boolean;

  @Output()
  hideRightSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  switchThemeMode: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  resizeFont: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostBinding('class.minimized') get minimized(): boolean {
    return this.rightSidebarMinimized;
  }

  onlineUsers$: Observable<User[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(OnlineUserListRequested());
    this.onlineUsers$ = this.store.pipe(select(selectUsersOnline));
  }

  get sidebarTipMessage(): string {
    return this.rightSidebarMinimized ? 'Show side panel' : 'Hide side panel';
  }

  // get fontTipMessage(): string {
  //   return this.font ? 'Zoom out font' : 'Zoom in font';
  // }

  toogleThemeMode(): void {
    this.switchThemeMode.emit(!this.themeModeSwitched);
  }

  toogleFontSize(): void {
    this.resizeFont.emit(!this.fontResized);
  }

  toggleRightSidebar(): void {
    this.hideRightSidebar.emit(!this.rightSidebarMinimized);
  }
}
