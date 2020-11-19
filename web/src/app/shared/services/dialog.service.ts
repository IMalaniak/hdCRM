import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DialogBaseModel } from '@/shared/components';
import { DialogDataModel, DialogType, DialogWithTwoButtonModel } from '@/shared/models';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DIALOG, STYLECONSTANTS } from '@/shared/constants';
import { DialogResultModel } from '@/shared/models/dialog/dialog-result.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private unsubscribe: Subject<void> = new Subject();

  constructor(private _matDialog: MatDialog) {}

  confirm<T extends DialogConfirmModel>(
    componentType: ComponentType<DialogBaseModel<T>>,
    data: DialogDataModel<T>,
    onConfirmCallback: Function
  ): void {
    this.open(componentType, data, DialogType.CONFIRM)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<unknown>) => {
        if (result && result.success) {
          onConfirmCallback();
        }
      });
  }

  open<T extends DialogWithTwoButtonModel>(
    componentType: ComponentType<DialogBaseModel<T>>,
    data: DialogDataModel<T>,
    dialogType: DialogType = DialogType.FIT_CONTENT
  ): MatDialogRef<DialogBaseModel<T>> {
    return this._matDialog.open(componentType, {
      data,
      closeOnNavigation: true,
      disableClose: true,
      height: STYLECONSTANTS.FIT_CONTENT,
      maxWidth: DIALOG.MAX_WIDTH,
      maxHeight: DIALOG.MAX_HEIGHT,
      ...this.getConfig(dialogType)
    });
  }

  private getConfig(dialogType?: DialogType): MatDialogConfig {
    switch (dialogType) {
      case DialogType.CONFIRM:
        return {
          width: '28em'
        };
      case DialogType.STANDART:
        return {
          width: '32em'
        };
      case DialogType.MAX:
        return {
          width: DIALOG.MAX_WIDTH
        };
      default:
        return {
          width: STYLECONSTANTS.FIT_CONTENT
        };
    }
  }
}
