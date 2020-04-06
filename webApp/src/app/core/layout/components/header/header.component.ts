import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MediaqueryService } from '@/shared';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { logOut } from '@/core/auth/store/auth.actions';
import { User } from '@/modules/users';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() leftSidebarMinimized: boolean;

  @Input() currentUser: User;

  @Output()
  hideLeftSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router, public mediaquery: MediaqueryService, private store: Store<AppState>) {}

  onLogoutClick(): void {
    this.store.dispatch(logOut());
  }

  toggleLeftSidebar(): void {
    this.hideLeftSidebar.emit(!this.leftSidebarMinimized);
  }
}
