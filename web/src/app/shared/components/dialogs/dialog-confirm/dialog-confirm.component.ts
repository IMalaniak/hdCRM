import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogBaseModel } from '../models/dialog-base.model';
import { DialogResultModel } from '@/shared/models/modal/dialog-result.model';
import { DialogDataModel } from '@/shared/models';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';
import { BaseModel } from '@/shared/models/base/base.model';

@Component({
  templateUrl: './dialog-confirm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogConfirmComponent<
  TDialogModel extends DialogConfirmModel,
  TModel extends BaseModel
> extends DialogBaseModel<TDialogModel, TModel> {
  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<any>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>
  ) {
    super(dialogRef, data);
  }

  onClose(result: boolean): void {
    this.dialogRef.close(new DialogResultModel(result, undefined));
  }
}
