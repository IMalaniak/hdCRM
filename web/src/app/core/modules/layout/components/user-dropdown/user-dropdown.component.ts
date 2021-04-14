import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { logOut } from '@core/modules/auth/store/auth.actions';
import { currentUser, isPrivileged } from '@core/modules/auth/store/auth.selectors';
import { User } from '@core/modules/user-api/shared';
import { MediaQueryService, IconsService } from '@core/services';
import { AppState } from '@core/store';
import {
  ACTION_LABEL,
  ADD_PRIVILEGE,
  BS_ICON,
  BUTTON_TYPE,
  MAT_BUTTON,
  RoutingConstants,
  THEME_PALETTE
} from '@shared/constants';

import { userDropdownVisible } from '../../store';
import { closeUserDropdown, toggleUserDropdown } from '../../store/layout.actions';

@Component({
  selector: 'user-dropdown-component',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDropdownComponent {
  @Output() logOut: EventEmitter<any> = new EventEmitter();

  currentUser$: Observable<User> = this.store$.select(currentUser);
  canAddUser$: Observable<boolean> = this.store$.select(isPrivileged(ADD_PRIVILEGE.USER));
  isShowUserMenu$: Observable<boolean> = this.store$.select(userDropdownVisible);

  actionLabels = ACTION_LABEL;
  buttonTypes = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  myProfileRoute = RoutingConstants.ROUTE_MY_PROFILE;
  userDropdownIcons: { [key: string]: BS_ICON } = {
    profile: BS_ICON.Person,
    invite: BS_ICON.PersonPlus,
    logOut: BS_ICON.BoxArrowRight,
    away: BS_ICON.Clock,
    busy: BS_ICON.SlashCircle,
    online: BS_ICON.AppIndicator,
    onBreak: BS_ICON.Cup
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
