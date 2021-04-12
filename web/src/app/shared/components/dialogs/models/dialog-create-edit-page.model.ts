import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Component, Inject } from '@angular/core';

import { DialogBaseModel } from './dialog-base.model';
import { DIALOG_MODE } from '@/shared/models/dialog/dialog-mode.enum';
import { DialogCreateEditModel, DialogDataModel } from '@/shared/models';

@Component({
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class DialogCreateEditPageModel extends DialogBaseModel<DialogCreateEditModel> {
  isCreateMode: boolean;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogCreateEditModel>
  ) {
    super(dialogRef, data);

    this.initializeModel();
  }

  initializeModel(): void {
    this.isCreateMode = this.dialogModel.dialogMode === DIALOG_MODE.CREATE;
    if (this.isCreateMode) {
      if (!this.data.model) {
        this.model = {} as any;
      }
    }
  }
}
