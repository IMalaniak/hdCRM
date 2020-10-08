import { DialogDataModel, DialogWithTwoButtonModel } from '@/shared/models';
import { BaseModel } from '@/shared/models/base/base.model';
import { ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogBaseModel } from '../models';

@Component({
  selector: 'component-dialog-base',
  templateUrl: './dialog-base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogBaseComponent<
  TDialogModel extends DialogWithTwoButtonModel,
  TModel extends BaseModel
> extends DialogBaseModel<TDialogModel, TModel> {
  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>,
    @Inject(DOCUMENT) private readonly _document: Document
  ) {
    super(dialogRef, data);
  }

  @HostListener('window:keyup.enter') onKeyUpEnter(): void {
    const successButton = this._document.getElementById('successButton');
    if (successButton) {
      this.dialogClose.emit(true);
    }
  }

  @HostListener('window:keyup.esc') onKeyUpEsc(): void {
    this.dialogClose.emit(false);
  }
}
