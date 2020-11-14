import { Output, EventEmitter, Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { DialogDataModel, DialogWithTwoButtonModel } from '@/shared/models';

@Component({
  template: ''
})
// tslint:disable-next-line:component-class-suffix
export abstract class DialogBaseModel<TDialogModel extends DialogWithTwoButtonModel> {
  @Input() closeButtonVisible = true;
  @Input() formValid = false;
  @Output() dialogClose: EventEmitter<boolean> = new EventEmitter();

  dialogModel: TDialogModel;
  model: any;
  title: string;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    protected data: DialogDataModel<TDialogModel>
  ) {
    this.dialogModel = data.dialogModel;
    this.model = this.data.model;
    this.title = this.dialogModel.titleMessageKey;
  }

  onClose(result: boolean): void {
    if (this.dialogClose) {
      this.dialogClose.emit(result);
    } else {
      this.dialogRef.close(result);
    }
  }
}
