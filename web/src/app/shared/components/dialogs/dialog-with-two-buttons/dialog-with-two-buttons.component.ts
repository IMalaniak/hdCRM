import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Inject } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogDataModel, DialogWithTwoButtonModel } from '@/shared/models';
import { DialogBaseModel } from '../models/dialog-base.model';
import { THEME_PALETTE } from '@/shared/constants';
import { BaseModel } from '@/shared/models/base';

@Component({
  selector: 'component-dialog',
  templateUrl: './dialog-with-two-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
  .dialog-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }
  `]
})
export class DialogWithTwoButtonsComponent<TDialogModel extends DialogWithTwoButtonModel, TModel extends BaseModel>
  extends DialogBaseModel<TDialogModel, TModel> {
  okButtonEnabled = false;
  cancelBtnColor = THEME_PALETTE.BASIC;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>
  ) {
    super(dialogRef, data);
  }

  onOkButtonClick(): void {
    this.dialogClose.emit(true);
  }

  onCancelButtonClick(): void {
    this.dialogClose.emit(false);
  }
}
