import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectAllUsers } from '../../store/user.selectors';
import { CONSTANTS, ACTION_LABELS, MAT_BUTTON, THEME_PALETTE } from '@/shared/constants';
import { DialogCreateEditModel, DialogDataModel, DialogResultModel } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';

@Component({
  templateUrl: './invitation-dialog.component.html',
  styleUrls: ['./invitation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitationDialogComponent<TDialogModel extends DialogCreateEditModel, TModel extends User>
  extends DialogBaseModel<TDialogModel, TModel>
  implements OnInit, OnDestroy {
  userData: FormGroup;
  appUsers: User[];
  invitedUsers: User[] = [];
  errorInvitations: boolean;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  matButtonType = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>,
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
        Validators.pattern(CONSTANTS.ONLY_TEXT_REGEX)
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

  onClose(result: boolean): void {
    this.dialogRef.close(new DialogResultModel(result, this.invitedUsers));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
