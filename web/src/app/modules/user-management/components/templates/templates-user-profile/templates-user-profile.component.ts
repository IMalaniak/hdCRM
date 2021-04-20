import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { updateUserOrgRequested, updateUserProfileRequested } from '@core/modules/auth/store/auth.actions';
import { isPrivileged } from '@core/modules/auth/store/auth.selectors';
import * as fromLayout from '@core/modules/layout/store';
import { User, Organization } from '@core/modules/user-api/shared';
import { updateUserRequested } from '@core/modules/user-api/store';
import { AppState } from '@core/store';
import { Preferences } from '@core/store/preferences';
import { changeIsEditingState } from '@modules/user-management/store';
import { TAB_PRIVILEGE, TAB_NAME, TAB_LABEL } from '@shared/constants';

@Component({
  selector: 'templates-user-profile',
  templateUrl: './templates-user-profile.component.html',
  styleUrls: ['./templates-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesUserProfileComponent implements OnInit {
  @Input() user: User;
  @Input() userPreferences: Preferences;
  @Input() currentSessionId: number;
  @Input() canEdit: boolean;
  @Input() isLoading: boolean;
  @Input() editForm: boolean;
  @Input() tabsToShow: TAB_NAME[] = [TAB_NAME.DETAILS];
  @Input() isProfilePage = false;

  enableDarkTheme$: Observable<boolean> = this.store.pipe(select(fromLayout.getDarkThemeState));
  canViewPreferences$: Observable<boolean> = this.store.pipe(select(isPrivileged(TAB_PRIVILEGE.PREFERENCE)));
  canViewIntegrations$: Observable<boolean> = this.store.pipe(select(isPrivileged(TAB_PRIVILEGE.INTEGRATION)));
  canViewOrganization$: Observable<boolean> = this.store.pipe(select(isPrivileged(TAB_PRIVILEGE.ORGANIZATION)));

  tabNames = TAB_NAME;
  tabLabels = TAB_LABEL;

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

  updateUser(user: User): void {
    if (this.isProfilePage) {
      this.store.dispatch(updateUserProfileRequested({ user }));
    } else {
      this.store.dispatch(updateUserRequested({ user }));
    }
  }

  updateUserOrg(organization: Organization): void {
    if (this.isProfilePage) {
      this.store.dispatch(updateUserOrgRequested({ organization }));
    } else {
      // @IMalaniak TODO update user org if needed
    }
  }

  isTabToShow(tab: TAB_NAME): boolean {
    return this.tabsToShow.includes(tab);
  }

  setFormEdit(isEditing: boolean): void {
    this.store.dispatch(changeIsEditingState({ isEditing }));
  }
}
