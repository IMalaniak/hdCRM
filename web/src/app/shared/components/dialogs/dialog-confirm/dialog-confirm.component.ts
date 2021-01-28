import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogBaseModel } from '../models/dialog-base.model';
import { IDialogResult } from '@/shared/models/dialog/dialog-result';
import { DialogDataModel } from '@/shared/models';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';

@Component({
  templateUrl: './dialog-confirm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogConfirmComponent extends DialogBaseModel<DialogConfirmModel> {
  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogConfirmModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: IDialogResult<unknown> = {
      success
    };
    this.dialogRef.close(result);
  }
}
