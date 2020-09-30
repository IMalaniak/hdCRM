import { Component, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { User, Organization } from '@/modules/users/models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { cloneDeep } from 'lodash';
import { Asset } from '@/shared/models';
import { updateUserRequested, changeIsEditingState } from '@/modules/users/store/user.actions';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import * as fromLayout from '@/core/layout/store';
import { updateUserOrgRequested, updateUserProfileRequested } from '@/core/auth/store/auth.actions';
import { ActivatedRoute } from '@angular/router';
import { Preferences } from '@/core/reducers/preferences.reducer';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import {
  TAB_PRIVILEGES,
  CONSTANTS,
  TAB_NAMES,
  TAB_LABELS,
  RoutingConstants,
  EDIT_PRIVILEGES,
  PATHS
} from '@/shared/constants';

@Component({
  selector: 'templates-user-profile',
  templateUrl: './templates-user-profile.component.html',
  styleUrls: ['./templates-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserProfileComponent implements OnInit, OnChanges {
  enableDarkTheme$: Observable<boolean> = this.store$.pipe(select(fromLayout.getDarkThemeState));
  canViewPreferences$: Observable<boolean> = this.store$.pipe(select(isPrivileged(TAB_PRIVILEGES.PREFERENCE)));
  canViewIntegrations$: Observable<boolean> = this.store$.pipe(select(isPrivileged(TAB_PRIVILEGES.INTEGRATION)));
  canViewOrganization$: Observable<boolean> = this.store$.pipe(select(isPrivileged(TAB_PRIVILEGES.ORGANIZATION)));
  canEdit$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.USER)));

  @Input() user: User;
  @Input() userPreferences: Preferences;
  @Input() currentSessionId: number;
  @Input() isLoading: boolean;
  @Input() editForm: boolean;
  @Input() tabsToShow: TAB_NAMES[] = [TAB_NAMES.DETAILS];
  @Input() isProfilePage = false;

  tabNames = TAB_NAMES;
  tabLabels = TAB_LABELS;

  baseUrl = environment.baseUrl;
  coverUrl = CONSTANTS.NO_IMAGE_URL;
  coverTitle = CONSTANTS.NO_IMAGE_TITLE;
  userInitial: User;

  constructor(private store$: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    let isEditing = false;
    if (!this.isProfilePage) {
      isEditing = this.route.snapshot.data[RoutingConstants.EDIT];
    }
    this.store$.dispatch(changeIsEditingState({ isEditing }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[PATHS.USER]?.currentValue && this.user) {
      this.userInitial = cloneDeep(this.user);
      if (this.user.avatar) {
        this.setCover(this.user.avatar);
      }
    }
  }

  setCover(cover: Asset): void {
    this.coverUrl = this.baseUrl + cover.location + '/' + cover.title;
    this.coverTitle = cover.title;
  }

  updateUserStore(asset?: Asset): void {
    if (asset) {
      this.setCover(asset);
    }
    const user: User = cloneDeep({ ...this.user, ...(asset && { avatar: asset, avatarId: asset.id }) });
    if (this.isProfilePage) {
      this.store$.dispatch(updateUserProfileRequested({ user }));
    } else {
      this.store$.dispatch(updateUserRequested({ user }));
    }
  }

  updateUser(user: User): void {
    this.user = user;
    this.updateUserStore();
  }

  updateUserOrg(organization: Organization): void {
    if (this.isProfilePage) {
      this.store$.dispatch(updateUserOrgRequested({ organization }));
    } else {
      // @IMalaniak TODO update user org if needed
    }
  }

  isTabToShow(tab: TAB_NAMES): boolean {
    return this.tabsToShow.includes(tab);
  }

  setFormEdit(isEditing: boolean): void {
    this.store$.dispatch(changeIsEditingState({ isEditing }));
  }

  checkIfCanEdit(canEdit: boolean): boolean {
    return !this.isProfilePage ? canEdit : true;
  }
}
