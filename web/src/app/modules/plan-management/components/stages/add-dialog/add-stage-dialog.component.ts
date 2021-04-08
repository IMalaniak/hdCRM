import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';

import { ACTION_LABEL, THEME_PALETTE } from '@/shared/constants';
import { DialogCreateEditPageModel } from '@/shared/components';
import { DialogCreateEditModel, DialogDataModel, IDialogResult } from '@/shared/models';

@Component({
  templateUrl: 'add-stage-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStageDialogComponent extends DialogCreateEditPageModel {
  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;
  keyString: FormControl;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogCreateEditModel>
  ) {
    super(dialogRef, data);
    this.keyString = new FormControl(null, [Validators.required, Validators.minLength(4)]);
  }

  onClose(success: boolean): void {
    const result: IDialogResult<string> = {
      success,
      data: this.keyString.value
    };
    this.dialogRef.close(result);
  }
}
