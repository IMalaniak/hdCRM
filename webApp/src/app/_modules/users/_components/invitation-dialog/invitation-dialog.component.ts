import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../../_models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { InviteUsers } from '../../store/user.actions';
import { selectAllUsers } from '../../store/user.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-invitation-dialog',
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss']
})
export class InvitationDialogComponent implements OnInit, OnDestroy {
  userData: FormGroup;
  appUsers: User[];
  invitedUsers: User[] = [];
  errorInvitations: boolean;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<InvitationDialogComponent>,
    private formBuilder: FormBuilder,
    private store$: Store<AppState>
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
    this.store$.pipe(select(selectAllUsers), takeUntil(this.unsubscribe)).subscribe(users => {
      this.appUsers = users;
    });
  }

  addUserToInvitation(user: User) {
    const alreadyInvited = this.invitedUsers.find(invitedUser => invitedUser.email === user.email);
    const alreadyAppUser = this.appUsers.find(appUser => appUser.email === user.email);
    if (alreadyInvited || alreadyAppUser) {
      this.errorInvitations = true;
      setTimeout(() => (this.errorInvitations = false), 3000);
    } else {
      this.invitedUsers.push(new User(user));
      this.userData.reset();
    }
  }

  sendInvitation() {
    this.store$.dispatch(new InviteUsers(this.invitedUsers));
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
