import { ComponentType } from '@angular/cdk/portal';
import { Component, HostListener, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';

import { DialogDataModel, DialogWithTwoButtonModel } from '@shared/models';

import { DialogBaseModel } from '../models';

@Component({
  selector: 'component-dialog-base',
  templateUrl: './dialog-base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .mat-dialog-content {
        overflow: visible;
      }
    `
  ]
})
export class DialogBaseComponent extends DialogBaseModel<DialogWithTwoButtonModel> {
  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogWithTwoButtonModel>,
    private router: Router
  ) {
    super(dialogRef, data);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        first()
      )
      .subscribe(() => {
        this.dialogRef.close(); // used for close dialog on navigation if it has nested component
      });
  }

  @HostListener('window:keyup.esc') onKeyUpEsc(): void {
    this.dialogClose.emit(false);
  }
}
