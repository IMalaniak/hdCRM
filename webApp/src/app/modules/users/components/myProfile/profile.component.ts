import { Component, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { getSessionId, currentUser } from '@/core/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { selectIsLoading, selectIsEditing } from '../../store/user.selectors';
import { getPreferencesState } from '@/core/reducers/preferences.selectors';
import { Preferences } from '@/core/reducers/preferences.reducer';

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

  tabsToShow: string[] = ['details', 'org', 'password', 'sessions', 'preferences'];

  constructor(private store: Store<AppState>) {}
}
