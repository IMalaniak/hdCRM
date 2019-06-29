import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { User } from '../../_models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { UserService } from '../../_services';
import { Update } from '@ngrx/entity';
import { UserSaved } from '../../store/user.actions';
import { ProfileSaved } from '@/core/auth/store/auth.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  userInitial: User;
  editForm = false;
  langs: string[];

  constructor(
    private userService: UserService,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.pipe(select(currentUser)).subscribe(user => {
      this.user = new User(user);
      this.userInitial = new User(user);
    });
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
  }

  onUpdateUserSubmit(): void {
    swal({
      title: 'Are you about to update user',
      text: 'Are you sure you want to update user details?',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.updateUser();
      }
    });
}

  updateUser(): void {
    this.userService.updateUser(this.user).subscribe(
      data => {
        const user: Update<User> = {
          id: this.user.id,
          changes: data
        };
        this.store.dispatch(new UserSaved({user}));

        // TODO: compress code
        this.user.name = data.name;
        this.user.surname = data.surname;
        this.user.login = data.login;
        this.user.email = data.email;
        this.user.phone = data.phone;
        this.user.updatedAt = data.updatedAt;
        this.user.avatar = data.avatar;
        this.user.avatarId = data.avatarId;

        // this.user = Object.assign(this.user, data);

        this.store.dispatch(new ProfileSaved({user: this.user}));

        this.editForm = false;
        swal({
          text: 'User updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
          text: 'Ooops, something went wrong!',
          type: 'error',
        });
      }
    );
  }


}
