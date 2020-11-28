import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { StagesComponent } from '../list/stages.component';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { Stage } from '@/modules/planner/models';

@Component({
  templateUrl: 'stages-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StagesDialogComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  @ViewChild(StagesComponent) stagesComponent: StagesComponent;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: DialogResultModel<Stage[]> = {
      success,
      model: this.stagesComponent.selection.selected
    };
    this.dialogRef.close(result);
  }
}
