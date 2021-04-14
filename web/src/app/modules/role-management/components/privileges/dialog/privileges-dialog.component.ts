import { ComponentType } from '@angular/cdk/portal';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Privilege } from '@core/modules/role-api/shared';
import { DialogBaseModel } from '@shared/components';
import { ACTION_LABEL, THEME_PALETTE } from '@shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, IDialogResult } from '@shared/models';

import { PrivilegesComponent } from '../list/privileges.component';

@Component({
  templateUrl: 'privileges-dialog.component.html'
})
export class PrivilegesDialogComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  @ViewChild(PrivilegesComponent) privilegesComponent: PrivilegesComponent;

  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: IDialogResult<Privilege[]> = {
      success,
      data: this.privilegesComponent.selection.selected
    };
    this.dialogRef.close(result);
  }
}
