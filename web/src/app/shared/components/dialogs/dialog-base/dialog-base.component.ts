import { Component, HostListener, Inject, ChangeDetectionStrategy } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { DialogBaseModel } from '../models';
import { BaseModel } from '@/shared/models/base/base.model';
import { DialogDataModel, DialogWithTwoButtonModel } from '@/shared/models';

@Component({
  selector: 'component-dialog-base',
  templateUrl: './dialog-base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogBaseComponent<
  TDialogModel extends DialogWithTwoButtonModel,
  TModel extends BaseModel
  > extends DialogBaseModel<TDialogModel, TModel> {
  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>,
    private _router: Router
  ) {
    super(dialogRef, data);

    this._router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.dialogRef.close(); // used for close dialog on navigation if it has nested component
    });
  }

  @HostListener('window:keyup.esc') onKeyUpEsc(): void {
    this.dialogClose.emit(false);
  }
}
