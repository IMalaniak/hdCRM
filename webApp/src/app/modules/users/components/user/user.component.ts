import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { User } from '../../models';

import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { selectIsLoading, selectIsEditing } from '../../store/user.selectors';

@Component({
  selector: 'user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  user: User;
  canEdit$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  editForm$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.user = cloneDeep(this.route.snapshot.data['user']);
    this.canEdit$ = this.store.pipe(select(isPrivileged('user-edit')));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));
    this.editForm$ = this.store.pipe(select(selectIsEditing));
  }
}
