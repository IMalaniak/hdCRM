import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { Privilege } from '@/core/modules/role-api/shared';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { PrivilegesComponent } from '../list/privileges.component';

@Component({
  templateUrl: 'privileges-dialog.component.html'
})
export class PrivilegesDialogComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  @ViewChild(PrivilegesComponent) privilegesComponent: PrivilegesComponent;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: DialogResultModel<Privilege[]> = {
      success,
      model: this.privilegesComponent.selection.selected
    };
    this.dialogRef.close(result);
  }
}
