import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

import { Store, select } from '@ngrx/store';

import { MediaqueryService } from '@/shared/services';
import { AppState } from '@/core/reducers';
import { logOut } from '@/core/auth/store/auth.actions';
import { User } from '@/modules/users';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { ACTION_LABELS, BUTTON_TYPE, MAT_BUTTON, THEME_PALETTE, RoutingConstants, CONSTANTS, ADD_PRIVILEGES } from '@/shared/constants';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  canAddUser$: Observable<boolean> = this.store.pipe(select(isPrivileged(ADD_PRIVILEGES.USER)));

  @Input() leftSidebarMinimized: boolean;
  @Input() enableDarkTheme: boolean;
  @Input() currentUser: User;

  @Output()
  hideLeftSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  enableThemeDark: EventEmitter<boolean> = new EventEmitter<boolean>();

  actionLabels = ACTION_LABELS;
  buttonTypes = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  myProfileRoute = RoutingConstants.ROUTE_MY_PROFILE;
  isShowUserMenu = false;

  constructor(
    public mediaquery: MediaqueryService,
    private store: Store<AppState>,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isShowUserMenu = false;
    });
  }

  closeUserMenu(): void {
    this.isShowUserMenu = false;
    this.cdr.detectChanges();
  }

  onLogoutClick(): void {
    this.store.dispatch(logOut());
  }

  toggleLeftSidebar(): void {
    this.hideLeftSidebar.emit(!this.leftSidebarMinimized);
  }

  themeTipMessage(): string {
    return this.enableDarkTheme ? CONSTANTS.TEXTS_THEME_LIGHT : CONSTANTS.TEXTS_THEME_DARK;
  }
}
