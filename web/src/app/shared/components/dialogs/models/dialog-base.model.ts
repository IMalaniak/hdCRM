import { Output, EventEmitter, Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { DialogDataModel, DialogWithTwoButtonModel } from '@/shared/models';
import { BaseModel } from '@/shared/models/base';

@Component({
  template: ''
})
// tslint:disable-next-line:component-class-suffix
export abstract class DialogBaseModel<TDialogModel extends DialogWithTwoButtonModel, TModel extends BaseModel> {
  @Input() closeButtonVisible = true;
  @Output() dialogClose: EventEmitter<boolean> = new EventEmitter();

  dialogModel: TDialogModel;
  model: TModel;
  title: string;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    protected data: DialogDataModel<TDialogModel, TModel>
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
