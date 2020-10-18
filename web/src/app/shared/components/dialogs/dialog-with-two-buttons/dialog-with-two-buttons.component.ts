import { Component, HostListener, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

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

  @HostListener('window:keyup.enter') onKeyUpEnter(): void {
    const successButton = this._document.getElementById('successButton');
    if (successButton && !this.formValid) {
      this.dialogClose.emit(true);
    }
  }

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>,
    @Inject(DOCUMENT) private readonly _document: Document
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
