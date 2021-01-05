import { Component, Inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '@/core/store';
import { selectFormByName, formRequested } from '@/core/store/dynamic-form';
import { DynamicForm } from '@/shared/models';
import { ACTION_LABELS, FORMCONSTANTS, THEME_PALETTE } from '@/shared/constants';
import { DialogCreateEditPageModel, DynamicFormComponent } from '@/shared/components';
import { DialogCreateEditModel, DialogDataModel, DialogResultModel } from '@/shared/models';
import { Task } from '@/modules/task-manager/models';

@Component({
  selector: 'organisms-task-dialog',
  templateUrl: './organisms-task-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsTaskDialogComponent extends DialogCreateEditPageModel {
  // TODO: @ArseniiIrod @IMalaniak investigate what to do with dialog, if it has dynamic form.
  // It will be better to extends from DynamicFormPageModel to exclude ViewChild and formInvalid state, but for now it -
  // is not possible, because this component must has an opportunity to has dinamiclly class extends.
  @ViewChild(DynamicFormComponent) dinamicForm: DynamicFormComponent;

  taskFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName(FORMCONSTANTS.TASK)));

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  get formInvalidState(): boolean {
    return this.dinamicForm?.form?.invalid || false;
  }

  constructor(
    private store$: Store<AppState>,
    readonly dialogRef: MatDialogRef<ComponentType<Task>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogCreateEditModel>
  ) {
    super(dialogRef, data);

    this.store$.dispatch(formRequested({ formName: FORMCONSTANTS.TASK }));
  }

  onClose(success: boolean): void {
    const result: DialogResultModel<Task> = {
      success,
      model: { ...this.model, ...this.dinamicForm.form.value }
    };
    this.dialogRef.close(result);
  }
}
