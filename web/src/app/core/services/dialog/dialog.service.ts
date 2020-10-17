import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DialogBaseModel } from '@/shared/components';
import { DialogDataModel, DialogType, DialogWithTwoButtonModel } from '@/shared/models';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';
import { DialogSizeService } from '@/shared/services';
import { DIALOG, STYLECONSTANTS } from '@/shared/constants';
import { BaseModel } from '@/shared/models/base/base.model';
import { DialogResultModel } from '@/shared/models/modal/dialog-result.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private unsubscribe: Subject<void> = new Subject();

  constructor(private _matDialog: MatDialog, private dialogSizeService: DialogSizeService) { }

  confirm<TDialogModel extends DialogConfirmModel, TModel extends BaseModel>(
    componentType: ComponentType<DialogBaseModel<TDialogModel, TModel>>,
    dialogModel: DialogDataModel<TDialogModel, TModel>,
    onConfirmCallback: Function
  ): void {
    this.open(componentType, dialogModel, this.dialogSizeService.getSize(DialogType.CONFIRM))
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<TModel>) => {
        if (result && result.succession) {
          onConfirmCallback();
        }
      });
  }

  open<TDialogModel extends DialogWithTwoButtonModel, TModel extends BaseModel>(
    componentType: ComponentType<DialogBaseModel<TDialogModel, TModel>>,
    data: DialogDataModel<TDialogModel, TModel>,
    dialogSize: MatDialogConfig = this.dialogSizeService.getSize()
  ): MatDialogRef<DialogBaseModel<TDialogModel, TModel>> {
    return this._matDialog.open(componentType, {
      data: data,
      closeOnNavigation: true,
      disableClose: true,
      height: STYLECONSTANTS.FIT_CONTENT,
      maxWidth: DIALOG.MAX_WIDTH,
      maxHeight: DIALOG.MAX_HEIGHT,
      ...dialogSize
    });
  }
}
