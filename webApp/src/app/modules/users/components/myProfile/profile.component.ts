import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { getSessionId, currentUser } from '@/core/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/shared';
import { selectIsLoading, getApiResponse, selectIsEditing } from '../../store/user.selectors';
import { getPreferencesState } from '@/core/reducers/preferences.selectors';
import { Preferences } from '@/core/reducers/preferences.reducer';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;
  userPreferences$: Observable<Preferences>;
  currentSessionId$: Observable<number>;
  isLoading$: Observable<boolean>;
  serverResponse$: Observable<ApiResponse>;
  tabsToShow: string[] = ['details', 'org', 'password', 'sessions', 'preferences'];
  editForm$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(currentUser));
    this.userPreferences$ = this.store.pipe(select(getPreferencesState));
    this.currentSessionId$ = this.store.pipe(select(getSessionId));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.serverResponse$ = this.store.pipe(select(getApiResponse));
    this.editForm$ = this.store.pipe(select(selectIsEditing));
  }
}
