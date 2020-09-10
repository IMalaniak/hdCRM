import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { inviteUsers } from '../../store/user.actions';
import { selectAllUsers } from '../../store/user.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ONLY_TEXT_REGEX } from '@/shared/constants';

@Component({
  selector: 'app-invitation-dialog',
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitationDialogComponent implements OnInit, OnDestroy {
  userData: FormGroup;
  appUsers: User[];
  invitedUsers: User[] = [];
  errorInvitations: boolean;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<InvitationDialogComponent>,
    private fb: FormBuilder,
    private store$: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store$.pipe(select(selectAllUsers), takeUntil(this.unsubscribe)).subscribe((users) => {
      this.appUsers = users;
    });
    this.buildUserFormGroup();
  }

  buildUserFormGroup(): void {
    this.userData = this.fb.group({
      fullname: new FormControl(null, [
        Validators.required,
        Validators.maxLength(25),
        Validators.pattern(ONLY_TEXT_REGEX)
      ]),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  addUserToInvitation(user: User): void {
    const alreadyInvited: User = this.invitedUsers.find((invitedUser) => invitedUser.email === user.email);
    const alreadyAppUser: User = this.appUsers.find((appUser) => appUser.email === user.email);

    if (alreadyInvited || alreadyAppUser) {
      this.errorInvitations = true;
      setTimeout(() => (this.errorInvitations = false), 3000);
    } else {
      this.invitedUsers = [...this.invitedUsers, user];
      this.userData.reset();
    }
  }

  sendInvitation(): void {
    this.store$.dispatch(inviteUsers({ users: this.invitedUsers }));
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
