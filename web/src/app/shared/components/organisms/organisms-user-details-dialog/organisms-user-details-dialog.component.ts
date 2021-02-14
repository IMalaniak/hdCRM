import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { User } from '@/core/modules/user-api/shared';
import { THEME_PALETTE, MAT_BUTTON, RoutingConstants } from '@/shared/constants';
import { DialogBaseModel } from '../../dialogs';
import { DialogDataModel, DialogWithTwoButtonModel, IDialogResult } from '@/shared/models';

@Component({
  selector: 'organisms-user-details-dialog',
  templateUrl: './organisms-user-details-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserDetailsDialogComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  user: User;
  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>
  ) {
    super(dialogRef, data);
    this.user = this.model;
  }

  onClose(success: boolean): void {
    const userDetailsRoute = `${RoutingConstants.ROUTE_USERS_DETAILS}/${this.user.id}`;
    const result: IDialogResult<string> = {
      success,
      data: userDetailsRoute
    };
    this.dialogRef.close(result);
  }
}
