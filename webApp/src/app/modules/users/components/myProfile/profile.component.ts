import { Component, OnInit } from '@angular/core';
import { User, State } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { currentUser, getSessionId } from '@/core/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/shared';
import { selectIsLoading, getApiResponse, selectIsEditing } from '../../store/user.selectors';
import { selectAllStates } from '../../store/state.selectors';
import { allStatesRequested } from '../../store/state.actions';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;
  states$: Observable<State[]>;
  currentSessionId$: Observable<number>;
  isLoading$: Observable<boolean>;
  serverResponse$: Observable<ApiResponse>;
  tabsToShow: string[] = ['details', 'password', 'sessions', 'preferences'];
  editForm$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(allStatesRequested());
    this.user$ = this.store.pipe(select(currentUser));
    this.currentSessionId$ = this.store.pipe(select(getSessionId));
    this.states$ = this.store.pipe(select(selectAllStates));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.serverResponse$ = this.store.pipe(select(getApiResponse));
    this.editForm$ = this.store.pipe(select(selectIsEditing));
  }
}
