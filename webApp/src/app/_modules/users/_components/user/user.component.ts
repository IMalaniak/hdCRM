import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '@/core/reducers';

import Swal from 'sweetalert2';

import { UserService } from '../../_services';
import { User, State } from '../../_models';

import { UserSaved, AllStatesRequested } from '../../store/user.actions';
import { Observable, Subject } from 'rxjs';
import { selectAllStates } from '../../store/user.selectors';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { takeUntil } from 'rxjs/operators';
import { Asset } from '@/_shared/attachments';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  showDataLoader: boolean;
  user: User;
  userInitial: User;
  states$: Observable<State[]>;
  editForm: boolean;
  editUserPrivilege$: Observable<boolean>;
  langs: string[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private store: Store<AppState>
  ) {
    this.editForm = false;
    this.showDataLoader = true;
  }

  ngOnInit(): void {
    this.editUserPrivilege$ = this.store.pipe(select(isPrivileged('user-edit')));
    this.editUserPrivilege$.pipe(takeUntil(this.unsubscribe)).subscribe(canEdit => {
      if (canEdit) {
        const edit = this.route.snapshot.queryParams['edit'];
        if (edit) {
          this.editForm = JSON.parse(edit);
        }
      }
    });
    this.getUserData();
  }

  getUserData(): void {
    // TODO: check
    // deep copy this.user = new User(JSON.parse(JSON.stringify(this.route.snapshot.data['user'])));
    this.user = new User(this.route.snapshot.data['user']);
    this.userInitial = new User(this.route.snapshot.data['user']);

    this.store.dispatch(new AllStatesRequested);

    this.states$ = this.store.pipe(select(selectAllStates));
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.user = this.userInitial;
  }

  onUpdateUserSubmit(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to save changes? You will not be able to recover this!',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.updateUser();
      }
    });
  }

  updateUser(): void {
    this.userService.updateUser(this.user).pipe(takeUntil(this.unsubscribe)).subscribe(
      data => {
        this.userInitial = new User(data);
        const user: Update<User> = {
          id: this.user.id,
          changes: new User(data)
        };
        this.store.dispatch(new UserSaved({user}));
        this.editForm = false;
        Swal.fire({
          text: 'User updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        Swal.fire({
          text: 'Ooops, something went wrong!',
          type: 'error',
          timer: 3000
        });
      }
    );
  }

  updateUserPic(data: Asset): void {
    this.user.avatar = data;
    this.user.avatarId = data.id;
    this.userInitial = new User(this.user);
    const user: Update<User> = {
      id: this.user.id,
      changes: new User(this.user)
    };
    this.store.dispatch(new UserSaved({user}));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
