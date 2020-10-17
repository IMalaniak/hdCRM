import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal/portal';

import { RolesComponent } from '../list/roles.component';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
import { BaseModel } from '@/shared/models/base';
import { DialogBaseModel } from '@/shared/components';

@Component({
  templateUrl: 'roles-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesDialogComponent<
  TDialogModel extends DialogWithTwoButtonModel,
  TModel extends BaseModel
> extends DialogBaseModel<TDialogModel, TModel> {
  @ViewChild(RolesComponent, { static: true }) rolesComponent: RolesComponent;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>
  ) {
    super(dialogRef, data);
  }

  onClose(result: boolean): void {
    return this.dialogRef.close(new DialogResultModel(result, this.rolesComponent.selection.selected));
  }
}
