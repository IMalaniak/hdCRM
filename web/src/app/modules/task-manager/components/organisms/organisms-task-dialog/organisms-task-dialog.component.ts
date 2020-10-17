import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '@/core/reducers';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';
import { DynamicForm } from '@/shared/models';
import { ACTION_LABELS, FORMCONSTANTS, THEME_PALETTE } from '@/shared/constants';
import { DialogCreateEditPageModel } from '@/shared/components';
import { DialogCreateEditModel, DialogDataModel, DialogResultModel } from '@/shared/models';
import { Task} from '@/modules/task-manager/models';

@Component({
  selector: 'organisms-task-dialog',
  templateUrl: './organisms-task-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsTaskDialogComponent<TDialogModel extends DialogCreateEditModel, TModel extends Task
  >
  extends DialogCreateEditPageModel<TDialogModel, TModel>
  implements OnInit {
  taskFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName(FORMCONSTANTS.TASK)));

  taskFormValues: Task;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    private store$: Store<AppState>,
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>,
  ) {
    super(dialogRef, data);
  }

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: FORMCONSTANTS.TASK }));
  }

  taskFormValueChanges(formVal: Task): void {
    this.taskFormValues = { ...this.taskFormValues, ...formVal };
  }

  onClose(result: boolean): void {
    this.dialogRef.close(new DialogResultModel(result, { ...this.model, ...this.taskFormValues }));
  }
}
