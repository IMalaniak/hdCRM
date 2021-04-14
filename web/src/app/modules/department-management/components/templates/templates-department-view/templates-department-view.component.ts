import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Department } from '@core/modules/department-api/shared';
import { selectDepartmentsLoading } from '@core/modules/department-api/store';
import { selectUserById, selectUsersById } from '@core/modules/user-api/store';
import { AppState } from '@core/store';
import { UsersDialogComponent } from '@modules/user-management/components';
import { prepareSelectionPopup, resetSelectionPopup } from '@modules/user-management/store';
import { TemplatesViewDetailsComponent } from '@shared/components/templates';
import { CommonConstants, FormNameConstants } from '@shared/constants';
import { DialogDataModel, IDialogResult, DIALOG_TYPE, DialogWithTwoButtonModel } from '@shared/models';
import { DialogService } from '@shared/services';

@Component({
  selector: 'templates-department-view',
  templateUrl: './templates-department-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesDepartmentViewComponent extends TemplatesViewDetailsComponent<Department> {
  isLoading$: Observable<boolean> = this.store$.pipe(select(selectDepartmentsLoading));

  protected readonly formName = FormNameConstants.DEPARTMENT;

  constructor(
    protected readonly store$: Store<AppState>,
    protected readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(store$, dialogService);
  }

  addManagerDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel()
    };
    this.store$.dispatch(prepareSelectionPopup({ selectedUsersIds: [this.item.Manager?.id], singleSelection: true }));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DIALOG_TYPE.MAX)
      .afterClosed()
      .subscribe((result: IDialogResult<number[]>) => {
        if (result?.success) {
          this.store$.pipe(select(selectUserById(result.data[0])), first()).subscribe((selectedManager) => {
            this.item = {
              ...this.item,
              Manager: { ...selectedManager },
              managerId: selectedManager.id
            };
            this.cdr.detectChanges();
          });
        }
        this.store$.dispatch(resetSelectionPopup());
      });
  }

  addWorkersDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel()
    };
    this.store$.dispatch(prepareSelectionPopup({ selectedUsersIds: this.item.Workers.map((user) => user.id) }));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DIALOG_TYPE.MAX)
      .afterClosed()
      .subscribe((result: IDialogResult<number[]>) => {
        if (result?.success) {
          const selectedWorkersIds: number[] = result.data.filter(
            (selectedWorkerId) => !this.item.Workers.some((user) => user.id === selectedWorkerId)
          );
          if (selectedWorkersIds?.length) {
            this.store$.pipe(select(selectUsersById(selectedWorkersIds)), first()).subscribe((selectedWorkers) => {
              this.item = {
                ...this.item,
                Workers: [...this.item.Workers, ...selectedWorkers]
              };
              this.cdr.detectChanges();
            });
          }
        }
        this.store$.dispatch(resetSelectionPopup());
      });
  }

  removeManager(): void {
    this.item = { ...this.item, Manager: null };
  }

  removeWorker(userId: number): void {
    this.item = { ...this.item, Workers: this.item.Workers.filter((worker) => worker.id !== userId) };
  }

  cardTitle(): string {
    return this.isCreatePage ? CommonConstants.TEXTS_CREATE_DEPARTMENT : this.item.title;
  }
}
