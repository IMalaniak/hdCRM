import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { User } from '@/modules/users';
import { THEME_PALETTE, MAT_BUTTON, RoutingConstants } from '@/shared/constants';
import { DialogBaseModel } from '../../dialogs';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';

@Component({
  selector: 'organisms-user-details-dialog',
  templateUrl: './organisms-user-details-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsUserDetailsDialogComponent<
  TDialogModel extends DialogWithTwoButtonModel,
  TModel extends User
> extends DialogBaseModel<TDialogModel, TModel> {
  user: User;
  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>
  ) {
    super(dialogRef, data);
    this.user = this.model;
  }

  onClose(result: boolean): void {
    const userDetailsRoute = `${RoutingConstants.ROUTE_USERS_DETAILS}/${this.user.id}`;
    this.dialogRef.close(new DialogResultModel(result, userDetailsRoute));
  }
}
