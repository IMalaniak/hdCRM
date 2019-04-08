import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AuthenticationService } from '@/_shared/services';
import { UserService } from '../../_services';
import { PrivilegeService, StateService } from '@/_shared/services';
import { User } from '../../_models';
import { Role } from '@/_modules/roles';
import { State } from '@/core/_models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  showDataLoader: boolean;
  baseUrl: string;
  user: User;
  userInitial: User;
  states: State[];
  editForm: boolean;
  editUserPrivilege: boolean;
  langs: string[];

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private userService: UserService,
    private stateService: StateService,
    private privilegeService: PrivilegeService,
  ) {
    this.baseUrl = environment.baseUrl;
    this.editForm = false;
    this.showDataLoader = true;
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.editUserPrivilege = this.privilegeService.isPrivileged(user, 'editUser');
    });
    this.getUserData();
  }

  getUserData(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.userService.getUser(id).subscribe(user => {
      this.user = user;
      this.userInitial = { ...this.user };

      this.stateService.getStatesList().subscribe(states => {
        this.states = states;
      });
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
          timer: 3000
        });
      }
    );
  }
}
