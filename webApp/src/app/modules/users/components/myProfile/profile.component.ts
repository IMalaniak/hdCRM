import { Component, OnInit } from '@angular/core';
import { User, State } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { Observable } from 'rxjs';
import { NewPassword, ApiResponse } from '@/shared';
import { changeOldPassword } from '../../store/user.actions';
import { selectIsLoading, getApiResponse } from '../../store/user.selectors';
import { selectAllStates } from '../../store/state.selectors';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;
  states$: Observable<State[]>;
  isLoading$: Observable<boolean>;
  serverResponse$: Observable<ApiResponse>;
  configProfileTabs = ['password'];
  currentPath: string;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(currentUser));
    this.states$ = this.store.pipe(select(selectAllStates));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.serverResponse$ = this.store.pipe(select(getApiResponse));
    this.currentPath = this.route.snapshot.url[0].path;
  }

  changeOldPassword(event: NewPassword): void {
    const newPassword: NewPassword = { ...event };
    this.store.dispatch(changeOldPassword({ newPassword }));
  }
}
