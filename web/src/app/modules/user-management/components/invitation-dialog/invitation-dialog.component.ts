import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/store';
import { User } from '@/core/modules/user-api/shared';
import { selectAllUsers } from '@/core/modules/user-api/store';
import { CommonConstants, ACTION_LABEL, MAT_BUTTON, THEME_PALETTE, BS_ICON, INPUT_TYPE } from '@/shared/constants';
import { DialogCreateEditModel, DialogDataModel, IDialogResult } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';

@Component({
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitationDialogComponent extends DialogBaseModel<DialogCreateEditModel> implements OnInit, OnDestroy {
  userData: FormGroup;
  appUsers: User[];
  invitedUsers: User[] = [];
  errorInvitations: boolean;

  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;
  matButtonType = MAT_BUTTON;
  inputTypes = INPUT_TYPE;
  dialogIcons: { [key: string]: BS_ICON } = {
    times: BS_ICON.X,
    add: BS_ICON.Plus
  };

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<User>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogCreateEditModel>,
    private fb: FormBuilder,
    private store$: Store<AppState>
  ) {
    super(dialogRef, data);
  }

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
        Validators.pattern(CommonConstants.ONLY_TEXT_REGEX)
      ]),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  addUserToInvitation(user: User): void {
    const alreadyInvited: User = this.invitedUsers.find((invitedUser) => invitedUser.email === user.email);
    const alreadyAppUser: User = this.appUsers.find((appUser) => appUser.email === user.email);

    if (alreadyInvited || alreadyAppUser) {
      this.errorInvitations = true;
      setTimeout(() => (this.errorInvitations = false), 3000); // TODO: @ArseniiIrod check why it doesn`t work
    } else {
      this.invitedUsers = [...this.invitedUsers, user];
      this.userData.reset();
    }
  }

  onClose(success: boolean): void {
    const result: IDialogResult<User[]> = {
      success,
      data: this.invitedUsers
    };
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
