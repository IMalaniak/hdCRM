import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DialogBaseModel } from '@/shared/components';
import { DialogDataModel, DialogType, DialogWithTwoButtonModel } from '@/shared/models';
import { DialogConfirmModal } from '@/shared/models/modal/dialog-question.model';
import { DialogSizeService } from '@/shared/services';
import { DIALOG, STYLECONSTANTS } from '@/shared/constants';
import { BaseModel } from '@/shared/models/base/base.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private _matDialog: MatDialog, private dialogSizeService: DialogSizeService) {}

  confirm<TDialogModel extends DialogConfirmModal, TModel extends BaseModel>(
    componentType: ComponentType<DialogBaseModel<TDialogModel, TModel>>,
    dialogModel: DialogDataModel<TDialogModel, TModel>
  ): Observable<boolean> {
    return this.open(componentType, dialogModel, this.dialogSizeService.getSize(DialogType.CONFIRM))
      .afterClosed()
      .pipe(
        map((result) => {
          if (result) {
            return result.result;
          } else {
            return false;
          }
        })
      );
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
