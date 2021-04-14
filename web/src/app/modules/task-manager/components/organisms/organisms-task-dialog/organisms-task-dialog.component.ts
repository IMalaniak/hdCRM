import { ComponentType } from '@angular/cdk/portal';
import { Component, Inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '@core/store';
import { selectFormByName, formRequested } from '@core/store/dynamic-form';
import { Task } from '@modules/task-manager/models';
import { DialogCreateEditPageModel, DynamicFormComponent } from '@shared/components';
import { ACTION_LABEL, FormNameConstants, THEME_PALETTE } from '@shared/constants';
import { DynamicForm } from '@shared/models';
import { DialogCreateEditModel, DialogDataModel, IDialogResult } from '@shared/models';

@Component({
  selector: 'organisms-task-dialog',
  templateUrl: './organisms-task-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsTaskDialogComponent extends DialogCreateEditPageModel {
  // TODO: @ArseniiIrod @IMalaniak investigate what to do with dialog, if it has dynamic form.
  // It will be better to extends from BaseDynamicFormPageModel to exclude ViewChild and formInvalid state, but for now it -
  // is not possible, because this component must has an opportunity to has dinamiclly class extends.
  @ViewChild(DynamicFormComponent) dynamicForm: DynamicFormComponent;

  taskFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName(FormNameConstants.TASK)));

  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;

  get formInvalidState(): boolean {
    return this.dynamicForm?.form?.invalid || false;
  }

  constructor(
    private store$: Store<AppState>,
    readonly dialogRef: MatDialogRef<ComponentType<Task>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogCreateEditModel>
  ) {
    super(dialogRef, data);

    this.store$.dispatch(formRequested({ formName: FormNameConstants.TASK }));
  }

  onClose(success: boolean): void {
    const result: IDialogResult<Task> = {
      success,
      data: { ...this.model, ...this.dynamicForm.form.value }
    };
    this.dialogRef.close(result);
  }
}
