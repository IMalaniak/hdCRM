import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MediaqueryService, smoothHeightTransition } from '@/shared';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { logOut } from '@/core/auth/store/auth.actions';
import { User } from '@/modules/users';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('openCloseAnimation', [
      state('true', style({ transform: 'translate(0, 0.6em)', opacity: 1, visibility: 'visible' })),
      state('false', style({ opacity: 0, visibility: 'hidden' })),
      transition('false => true', animate('150ms ease')),
      transition('true => false', animate(50))
    ]),
    smoothHeightTransition
  ]
})
export class HeaderComponent {
  @Input() leftSidebarMinimized: boolean;
  @Input() currentUser: User;

  @Output()
  hideLeftSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  isShowUserMenu = false;
  isShowStatuses = false;

  constructor(public mediaquery: MediaqueryService, private store: Store<AppState>) {}

  onLogoutClick(): void {
    this.store.dispatch(logOut());
  }

  toggleLeftSidebar(): void {
    this.hideLeftSidebar.emit(!this.leftSidebarMinimized);
  }
}
