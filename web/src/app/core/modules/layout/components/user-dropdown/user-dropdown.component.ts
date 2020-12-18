import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { MediaQueryService, IconsService } from '@/core/services';
import { AppState } from '@/core/store';
import { currentUser, isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import { logOut } from '@/core/modules/auth/store/auth.actions';
import {
  ACTION_LABELS,
  ADD_PRIVILEGES,
  BS_ICONS,
  BUTTON_TYPE,
  MAT_BUTTON,
  RoutingConstants,
  THEME_PALETTE
} from '@/shared/constants';
import { User } from '@/modules/users';
import { closeUserDropdown, toggleUserDropdown } from '../../store/layout.actions';
import { userDropdownVisible } from '../../store';

@Component({
  selector: 'user-dropdown-component',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDropdownComponent {
  currentUser$: Observable<User> = this.store$.select(currentUser);
  canAddUser$: Observable<boolean> = this.store$.select(isPrivileged(ADD_PRIVILEGES.USER));

  isShowUserMenu$: Observable<boolean> = this.store$.select(userDropdownVisible);
  @Output() logOut: EventEmitter<any> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  buttonTypes = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  myProfileRoute = RoutingConstants.ROUTE_MY_PROFILE;
  userDropdownIcons: { [key: string]: BS_ICONS } = {
    profile: BS_ICONS.Person,
    invite: BS_ICONS.PersonPlus,
    logOut: BS_ICONS.BoxArrowRight,
    away: BS_ICONS.Clock,
    busy: BS_ICONS.SlashCircle,
    online: BS_ICONS.AppIndicator,
    onBreak: BS_ICONS.Cup
  };

  constructor(
    private readonly store$: Store<AppState>,
    private readonly mediaQueryService: MediaQueryService,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([...Object.values(this.userDropdownIcons)]);
  }

  toggleNotification(): void {
    this.store$.dispatch(toggleUserDropdown());
  }

  closeUserMenu(): void {
    this.store$.dispatch(closeUserDropdown());
  }

  onLogoutClick(): void {
    this.store$.dispatch(logOut());
  }

  getOffsetX(): number {
    return this.mediaQueryService.isPhone ? 4 : 32;
  }
}
