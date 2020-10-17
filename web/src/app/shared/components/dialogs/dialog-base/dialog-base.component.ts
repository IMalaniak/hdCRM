import { DialogDataModel, DialogWithTwoButtonModel } from '@/shared/models';
import { BaseModel } from '@/shared/models/base/base.model';
import { ComponentType } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { DialogBaseModel } from '../models';

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
    @Inject(DOCUMENT) private readonly _document: Document,
    private _router: Router
  ) {
    super(dialogRef, data);

    this._router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.dialogRef.close(); // used for close dialog on navigation if it has nested component
    });
  }

  @HostListener('window:keyup.enter') onKeyUpEnter(): void {
    const successButton = this._document.getElementById('successButton');
    if (successButton && this.formValid) { // TODO: @ArseniiIrod, @IMalaniak check situation if dialog has no form and user press enter key, for now the result is false
      this.dialogClose.emit(true);
    }
  }

  @HostListener('window:keyup.esc') onKeyUpEsc(): void {
    this.dialogClose.emit(false);
  }
}
