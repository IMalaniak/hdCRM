import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { UsersComponent } from '../list/users.component';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { User } from '../../models';

@Component({
  templateUrl: 'users-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDialogComponent<
  TDialogModel extends DialogWithTwoButtonModel
> extends DialogBaseModel<TDialogModel> {
  @ViewChild(UsersComponent, { static: true })
  usersComponent: UsersComponent;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: DialogResultModel<User[]> = {
      success,
      model: this.usersComponent.selection.selected
    };
    this.dialogRef.close(result);
  }
}
