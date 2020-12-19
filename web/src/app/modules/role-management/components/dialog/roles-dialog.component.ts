import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal/portal';

import { Role } from '@/core/modules/role-api/shared';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { RolesComponent } from '../list/roles.component';

@Component({
  templateUrl: 'roles-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesDialogComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  @ViewChild(RolesComponent) rolesComponent: RolesComponent;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>
  ) {
    super(dialogRef, data);
  }

  onClose(success: boolean): void {
    const result: DialogResultModel<Role[]> = {
      success,
      model: this.rolesComponent.selection.selected
    };
    return this.dialogRef.close(result);
  }
}
