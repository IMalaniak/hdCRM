import { Component, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { cloneDeep } from 'lodash';

import { environment } from 'environments/environment';
import { AppState } from '@/core/reducers';
import * as fromLayout from '@/core/modules/layout/store';
import { updateUserOrgRequested, updateUserProfileRequested } from '@/core/modules/auth/store/auth.actions';
import { Preferences } from '@/core/reducers/preferences/preferences.reducer';
import { isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import { Asset } from '@/shared/models';
import { TAB_PRIVILEGES, CONSTANTS, TAB_NAMES, TAB_LABELS } from '@/shared/constants';
import { updateUserRequested, changeIsEditingState } from '@/modules/users/store/user.actions';
import { User, Organization } from '@/modules/users/models';

@Component({
  selector: 'templates-user-profile',
  templateUrl: './templates-user-profile.component.html',
  styleUrls: ['./templates-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserProfileComponent implements OnInit, OnChanges {
  enableDarkTheme$: Observable<boolean> = this.store.pipe(select(fromLayout.getDarkThemeState));
  canViewPreferences$: Observable<boolean> = this.store.pipe(select(isPrivileged(TAB_PRIVILEGES.PREFERENCE)));
  canViewIntegrations$: Observable<boolean> = this.store.pipe(select(isPrivileged(TAB_PRIVILEGES.INTEGRATION)));
  canViewOrganization$: Observable<boolean> = this.store.pipe(select(isPrivileged(TAB_PRIVILEGES.ORGANIZATION)));

  @Input() user: User;
  @Input() userPreferences: Preferences;
  @Input() currentSessionId: number;
  @Input() canEdit: boolean;
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

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.canEdit) {
      let isEditing = this.route.snapshot.queryParams['edit'];
      if (isEditing) {
        isEditing = JSON.parse(isEditing);
        this.store.dispatch(changeIsEditingState({ isEditing }));
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue && this.user) {
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
    const user = cloneDeep({ ...this.user, ...(asset && { avatar: asset, avatarId: asset.id }) });
    if (this.isProfilePage) {
      this.store.dispatch(updateUserProfileRequested({ user }));
    } else {
      this.store.dispatch(updateUserRequested({ user }));
    }
  }

  updateUser(user: User): void {
    this.user = user;
    this.updateUserStore();
  }

  updateUserOrg(organization: Organization): void {
    if (this.isProfilePage) {
      this.store.dispatch(updateUserOrgRequested({ organization }));
    } else {
      // @IMalaniak TODO update user org if needed
    }
  }

  isTabToShow(tab: TAB_NAMES): boolean {
    return this.tabsToShow.includes(tab);
  }

  setFormEdit(isEditing: boolean): void {
    this.store.dispatch(changeIsEditingState({ isEditing }));
  }
}
