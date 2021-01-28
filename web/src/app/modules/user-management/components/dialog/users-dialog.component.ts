import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { User } from '@/core/modules/user-api/shared';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogWithTwoButtonModel, IDialogResult } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { UsersComponent } from '../list/users.component';

@Component({
  templateUrl: 'users-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDialogComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  @ViewChild(UsersComponent) usersComponent: UsersComponent;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: IDialogResult<User[]> = {
      success,
      data: null // TODO: how can we override this by using only store?
    };
    this.dialogRef.close(result);
  }
}
