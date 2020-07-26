import { Component, OnInit } from '@angular/core';
import { User } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { getSessionId } from '@/core/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/shared';
import { selectIsLoading, getApiResponse, selectIsEditing } from '../../store/user.selectors';
import { cloneDeep } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { getPreferencesState } from '@/core/reducers/preferences.selectors';
import { Preferences } from '@/core/reducers/preferences.reducer';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: User;
  userPreferences$: Observable<Preferences>;
  currentSessionId$: Observable<number>;
  isLoading$: Observable<boolean>;
  serverResponse$: Observable<ApiResponse>;
  tabsToShow: string[] = ['details', 'org', 'password', 'sessions', 'preferences'];
  editForm$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.user = cloneDeep(this.route.snapshot.data['user']);
    this.userPreferences$ = this.store.pipe(select(getPreferencesState));
    this.currentSessionId$ = this.store.pipe(select(getSessionId));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.serverResponse$ = this.store.pipe(select(getApiResponse));
    this.editForm$ = this.store.pipe(select(selectIsEditing));
  }
}
