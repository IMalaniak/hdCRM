import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { User } from '../../models';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { selectIsLoading, selectIsEditing, selectUserById } from '../../store/user.selectors';
import { tap } from 'rxjs/internal/operators/tap';
import { userRequested } from '../../store/user.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  user$: Observable<User>;
  canEdit$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  editForm$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('id');

    this.user$ = this.store.pipe(
      select(selectUserById(id)),
      tap(user => {
        if (!user) {
          this.store.dispatch(userRequested({ id }));
        }
      }),
      filter(user => !!user)
    );
    this.canEdit$ = this.store.pipe(select(isPrivileged('user-edit')));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.editForm$ = this.store.pipe(select(selectIsEditing));
  }
}
