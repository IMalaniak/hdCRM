import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { getPreferencesState, Preferences } from '@/core/store/preferences';
import { getSessionId, currentUser } from '@/core/modules/auth/store/auth.selectors';
import { TAB_NAMES } from '@/shared/constants';
import { selectIsLoading, selectIsEditing } from '../../store/user.selectors';
import { User } from '../../models';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  user$: Observable<User> = this.store.pipe(select(currentUser));
  editForm$: Observable<boolean> = this.store.pipe(select(selectIsEditing));
  isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  currentSessionId$: Observable<number> = this.store.pipe(select(getSessionId));
  userPreferences$: Observable<Preferences> = this.store.pipe(select(getPreferencesState));

  tabsToShow: TAB_NAMES[] = [
    TAB_NAMES.DETAILS,
    TAB_NAMES.ORGANIZATION,
    TAB_NAMES.PASSWORD,
    TAB_NAMES.SESSIONS,
    TAB_NAMES.PREFERENCES,
    TAB_NAMES.INTEGRATIONS
  ];

  constructor(private store: Store<AppState>) {}
}
