import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { getPreferencesState, Preferences } from '@/core/store/preferences';
import { getSessionId, currentUser } from '@/core/modules/auth/store/auth.selectors';
import { User } from '@/core/modules/user-api/shared';
import { selectUserApiIsLoading } from '@/core/modules/user-api/store';
import { TAB_NAME } from '@/shared/constants';
import { selectIsEditing } from '../../store';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  user$: Observable<User> = this.store.pipe(select(currentUser));
  editForm$: Observable<boolean> = this.store.pipe(select(selectIsEditing));
  isLoading$: Observable<boolean> = this.store.pipe(select(selectUserApiIsLoading));
  currentSessionId$: Observable<number> = this.store.pipe(select(getSessionId));
  userPreferences$: Observable<Preferences> = this.store.pipe(select(getPreferencesState));

  tabsToShow: TAB_NAME[] = [
    TAB_NAME.DETAILS,
    TAB_NAME.ORGANIZATION,
    TAB_NAME.PASSWORD,
    TAB_NAME.SESSIONS,
    TAB_NAME.PREFERENCES,
    TAB_NAME.INTEGRATIONS
  ];

  constructor(private store: Store<AppState>) {}
}
