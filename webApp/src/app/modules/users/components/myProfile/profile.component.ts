import { Component, OnInit } from '@angular/core';
import { User, State } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { currentUser, getSessionId } from '@/core/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { NewPassword, ApiResponse } from '@/shared';
import { changeOldPassword } from '../../store/user.actions';
import { selectIsLoading, getApiResponse } from '../../store/user.selectors';
import { selectAllStates } from '../../store/state.selectors';
import { ActivatedRoute } from '@angular/router';
import { deleteSession, deleteMultipleSession } from '@/core/auth/store/auth.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;
  states$: Observable<State[]>;
  currentSessionId$: Observable<number>;
  isLoading$: Observable<boolean>;
  serverResponse$: Observable<ApiResponse>;
  tabsToShow: string[] = ['details', 'password', 'sessions'];

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(currentUser));
    this.currentSessionId$ = this.store.pipe(select(getSessionId));
    this.states$ = this.store.pipe(select(selectAllStates));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.serverResponse$ = this.store.pipe(select(getApiResponse));
  }

  changePassword(newPassword: NewPassword): void {
    this.store.dispatch(changeOldPassword({ newPassword }));
  }

  removeSession(sessionIds: number | number[]): void {
    if (typeof sessionIds === 'number') {
      this.store.dispatch(deleteSession({ id: sessionIds }));
    } else {
      this.store.dispatch(deleteMultipleSession({ sessionIds }));
    }
  }
}
