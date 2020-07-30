import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MediaqueryService } from '@/shared';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { logOut } from '@/core/auth/store/auth.actions';
import { User } from '@/modules/users';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() leftSidebarMinimized: boolean;
  @Input() currentUser: User;

  @Output()
  hideLeftSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  isShowUserMenu = false;

  constructor(public mediaquery: MediaqueryService, private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.isShowUserMenu = false;
    });
  }

  onLogoutClick(): void {
    this.store.dispatch(logOut());
  }

  toggleLeftSidebar(): void {
    this.hideLeftSidebar.emit(!this.leftSidebarMinimized);
  }
}
