import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Inject, OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { DialogDataModel, DialogWithTwoButtonModel } from '@/shared/models';
import { DialogBaseModel } from '../models/dialog-base.model';
import { THEME_PALETTE } from '@/shared/constants';
import { BaseModel } from '@/shared/models/base';

@Component({
  selector: 'component-dialog',
  templateUrl: './dialog-with-two-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogWithTwoButtonsComponent<TDialogModel extends DialogWithTwoButtonModel, TModel extends BaseModel>
  extends DialogBaseModel<TDialogModel, TModel>
  implements OnDestroy {
  okButtonEnabled = false;
  cancelBtnColor = THEME_PALETTE.BASIC;

  private unsubscribe: Subject<void> = new Subject();

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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
