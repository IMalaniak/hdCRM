import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { Department } from '@/core/modules/department-api/shared';
import { selectDepartmentsLoading } from '@/core/modules/department-api/store';
import { DialogService } from '@/shared/services';
import { TemplatesViewDetailsComponent } from '@/shared/components/templates';
import { CONSTANTS, FORMCONSTANTS } from '@/shared/constants';
import { DialogDataModel, IDialogResult, DialogType, DialogWithTwoButtonModel } from '@/shared/models';
import { UsersDialogComponent } from '@/modules/user-management/components';
import { prepareSelectionPopup, resetSelectionPopup } from '@/modules/user-management/store';
import { selectUserById, selectUsersById } from '@/core/modules/user-api/store';

@Component({
  selector: 'templates-department-view',
  templateUrl: './templates-department-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesDepartmentViewComponent extends TemplatesViewDetailsComponent<Department> {
  isLoading$: Observable<boolean> = this.store$.pipe(select(selectDepartmentsLoading));

  protected readonly formName = FORMCONSTANTS.DEPARTMENT;

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
      .open(UsersDialogComponent, dialogDataModel, DialogType.MAX)
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
          this.cdr.detectChanges();
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
      .open(UsersDialogComponent, dialogDataModel, DialogType.MAX)
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
    return this.isCreatePage ? CONSTANTS.TEXTS_CREATE_DEPARTMENT : this.item.title;
  }
}
