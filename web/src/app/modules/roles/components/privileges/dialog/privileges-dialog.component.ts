import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { PrivilegesComponent } from '../list/privileges.component';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, ModalDialogResult } from '@/shared/models';
import { DialogBaseModel } from '@/shared/components';
import { BaseModel } from '@/shared/models/base/base.model';

@Component({
  templateUrl: 'privileges-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivilegesDialogComponent<
  TDialogModel extends DialogWithTwoButtonModel,
  TModel extends BaseModel
> extends DialogBaseModel<TDialogModel, TModel> {
  @ViewChild(PrivilegesComponent, { static: true }) privilegesComponent: PrivilegesComponent;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>
  ) {
    super(dialogRef, data);
  }

  onClose(result: boolean): void {
    this.dialogRef.close(new ModalDialogResult(result, this.privilegesComponent.selection.selected));
  }
}
