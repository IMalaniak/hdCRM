import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';

import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogCreateEditPageModel } from '@/shared/components';
import { DialogCreateEditModel, DialogDataModel, DialogResultModel } from '@/shared/models';
import { BaseModel } from '@/shared/models/base/base.model';

@Component({
  templateUrl: 'add-stage-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStageDialogComponent<
  TDialogModel extends DialogCreateEditModel,
  TModel extends BaseModel
> extends DialogCreateEditPageModel<TDialogModel, TModel> {
  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  keyString: FormControl;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>
  ) {
    super(dialogRef, data);
    this.keyString = new FormControl(null, [Validators.required, Validators.minLength(4)]);
  }

  onClose(result: boolean): void {
    this.dialogRef.close(new DialogResultModel(result, this.keyString.value));
  }
}
