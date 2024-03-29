import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { DialogBaseModel } from '@shared/components';
import { DialogConstants, STYLE } from '@shared/constants';
import { DialogDataModel, DIALOG_TYPE, DialogWithTwoButtonModel } from '@shared/models';
import { DialogConfirmModel } from '@shared/models/dialog/dialog-confirm.model';
import { IDialogResult } from '@shared/models/dialog/dialog-result';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private _matDialog: MatDialog) {}

  confirm<T extends DialogConfirmModel>(
    componentType: ComponentType<DialogBaseModel<T>>,
    data: DialogDataModel<T>,
    onConfirmCallback: () => void
  ): void {
    this.open(componentType, data, DIALOG_TYPE.CONFIRM)
      .afterClosed()
      .subscribe((result: IDialogResult<unknown>) => {
        if (result?.success) {
          onConfirmCallback();
        }
      });
  }

  open<T extends DialogWithTwoButtonModel>(
    componentType: ComponentType<DialogBaseModel<T>>,
    data: DialogDataModel<T>,
    dialogType: DIALOG_TYPE = DIALOG_TYPE.FIT_CONTENT
  ): MatDialogRef<DialogBaseModel<T>> {
    return this._matDialog.open(componentType, {
      data,
      closeOnNavigation: true,
      disableClose: true,
      height: STYLE.FIT_CONTENT,
      maxWidth: DialogConstants.MAX_WIDTH,
      maxHeight: DialogConstants.MAX_HEIGHT,
      ...this.getConfig(dialogType)
    });
  }

  private getConfig(dialogType?: DIALOG_TYPE): MatDialogConfig {
    switch (dialogType) {
      case DIALOG_TYPE.CONFIRM:
        return {
          width: '28em'
        };
      case DIALOG_TYPE.STANDART:
        return {
          width: '32em'
        };
      case DIALOG_TYPE.MAX:
        return {
          width: DialogConstants.MAX_WIDTH
        };
      default:
        return {
          width: STYLE.FIT_CONTENT
        };
    }
  }
}
