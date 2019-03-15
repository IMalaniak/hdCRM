import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { UserService } from '@/_services';
import { User } from '@/_models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  baseUrl: string;
  user: User;
  userInitial: User;
  editForm: boolean;
  langs: string[];

  constructor(
    private userService: UserService
  ) {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.getUserData();
    this.editForm = false;
  }

  getUserData(): void {
    this.userService.getProfile().subscribe(profile => {
      this.user = profile;
      this.userInitial = { ...this.user };
    });
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.user = this.userInitial;
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
      user => {
        this.user = user;
        this.userInitial = { ...this.user };
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
