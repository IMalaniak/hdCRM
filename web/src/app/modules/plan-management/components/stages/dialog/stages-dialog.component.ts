import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { Stage } from '@/core/modules/plan-api/shared';
import { ACTION_LABEL, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, IDialogResult } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { StagesComponent } from '../list/stages.component';

@Component({
  templateUrl: 'stages-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StagesDialogComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  @ViewChild(StagesComponent) stagesComponent: StagesComponent;

  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: IDialogResult<Stage[]> = {
      success,
      data: this.stagesComponent.selection.selected
    };
    this.dialogRef.close(result);
  }
}
