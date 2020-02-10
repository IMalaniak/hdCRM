import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../_services';
import { User } from '../../_models';

@Component({
  selector: 'app-invitation-dialog',
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss']
})
export class InvitationDialogComponent implements OnInit {
  userData: FormGroup;
  users: User[] = [];
  errorInvitations: boolean;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<InvitationDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.userData = this.formBuilder.group({
      fullname: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
        Validators.pattern(
          "^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
        )
      ]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  addUserToInvitation(user: User) {
    const result = this.users.filter(invitedUser => invitedUser.email === user.email);
    if (result.length === 1) {
      this.errorInvitations = true;
      setTimeout(() => this.errorInvitations = false, 3000);
    } else {
      this.users.push(new User(user));
      this.userData.reset();
    }
  }

  sendInvitation() {
    this.userService.inviteUsers(this.users).subscribe();
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
