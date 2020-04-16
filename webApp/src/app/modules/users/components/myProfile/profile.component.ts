import { Component, OnInit } from '@angular/core';
import { User } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user$: Observable<User>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(currentUser));
  }
}
