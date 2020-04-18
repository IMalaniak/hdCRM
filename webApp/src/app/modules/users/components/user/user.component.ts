import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { User } from '../../models';

import { isPrivileged } from '@/core/auth/store/auth.selectors';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  user: User;
  canEdit$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.canEdit$ = this.store.pipe(select(isPrivileged('user-edit')));
    this.user = cloneDeep(this.route.snapshot.data['user']);
  }

}
