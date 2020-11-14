import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogBaseModel } from '../models/dialog-base.model';
import { DialogResultModel } from '@/shared/models/modal/dialog-result.model';
import { DialogDataModel } from '@/shared/models';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';

@Component({
  templateUrl: './dialog-confirm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogConfirmComponent<
  TDialogModel extends DialogConfirmModel
> extends DialogBaseModel<TDialogModel> {
  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: DialogResultModel<unknown> = {
      success,
      model: undefined
    };
    this.dialogRef.close(result);
  }
}
