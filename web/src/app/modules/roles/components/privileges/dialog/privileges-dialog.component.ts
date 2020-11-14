import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { PrivilegesComponent } from '../list/privileges.component';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { Privilege } from '@/modules/roles/models';

@Component({
  templateUrl: 'privileges-dialog.component.html'
})
export class PrivilegesDialogComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  @ViewChild(PrivilegesComponent, { static: true }) privilegesComponent: PrivilegesComponent;

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
