import { Component, HostListener, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { DialogDataModel, DialogWithTwoButtonModel } from '@/shared/models';
import { THEME_PALETTE } from '@/shared/constants';

import { DialogBaseModel } from '../models/dialog-base.model';

@Component({
  selector: 'component-dialog',
  templateUrl: './dialog-with-two-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .dialog-buttons {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.5rem;
      }
    `
  ]
})
export class DialogWithTwoButtonsComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  cancelBtnColor = THEME_PALETTE.BASIC;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    super(dialogRef, data);
  }

  @HostListener('window:keyup.enter') onKeyUpEnter(): void {
    const successButton = this.document.getElementById('successButton');
    if (successButton && !this.formInvalid) {
      this.dialogClose.emit(true);
    }
  }

  onOkButtonClick(): void {
    this.dialogClose.emit(true);
  }

  onCancelButtonClick(): void {
    this.dialogClose.emit(false);
  }
}
