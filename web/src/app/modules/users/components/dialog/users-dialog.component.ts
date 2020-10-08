import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { UsersComponent } from '../list/users.component';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogWithTwoButtonModel, ModalDialogResult } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { BaseModel } from '@/shared/models/base/base.model';

@Component({
  templateUrl: 'users-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDialogComponent<
  TDialogModel extends DialogWithTwoButtonModel,
  TModel extends BaseModel
> extends DialogBaseModel<TDialogModel, TModel> {
  @ViewChild(UsersComponent, { static: true })
  usersComponent: UsersComponent;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>
  ) {
    super(dialogRef, data);
  }

  onClose(result: boolean): void {
    this.dialogRef.close(new ModalDialogResult(result, this.usersComponent.selection.selected));
  }
}
