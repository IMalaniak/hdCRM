import { ComponentType } from '@angular/cdk/portal';
import { Output, EventEmitter, Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogDataModel, DialogWithTwoButtonModel } from '@shared/models';

@Component({
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class DialogBaseModel<T extends DialogWithTwoButtonModel> {
  @Input() closeButtonVisible = true;
  @Input() formInvalid = false;
  @Output() dialogClose: EventEmitter<boolean> = new EventEmitter();

  dialogModel: T;
  model: any;
  title: string;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<T>
  ) {
    this.dialogModel = data.dialogModel;
    this.model = data.model;
    this.title = this.dialogModel.title;
  }

  onClose(result: boolean): void {
    if (this.dialogClose) {
      this.dialogClose.emit(result);
    } else {
      this.dialogRef.close(result);
    }
  }
}
