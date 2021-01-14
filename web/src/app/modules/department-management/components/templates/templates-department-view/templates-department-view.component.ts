import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { User } from '@/core/modules/user-api/shared';
import { Department } from '@/core/modules/department-api/shared';
import { DialogService } from '@/shared/services';
import { TemplatesViewDetailsComponent } from '@/shared/components/templates';
import { CONSTANTS, FORMCONSTANTS } from '@/shared/constants';
import { DialogDataModel, DialogResultModel, DialogType, DialogWithTwoButtonModel } from '@/shared/models';
import { UsersDialogComponent } from '@/modules/user-management/components';
import { selectDepartmentsLoading } from '@/core/modules/department-api/store/department-api.selectors';

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
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_MANAGER)
    };

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DialogType.MAX)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.success) {
          this.item = {
            ...this.item,
            Manager: { ...result.model[0] },
            managerId: result.model[0].id
          };
          this.cdr.detectChanges();
        }
      });

    // TODO: @ArsenIrod add afterOpened logic
  }

  addWorkersDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_WORKERS)
    };

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DialogType.MAX)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.success) {
          const selectedWorkers: User[] = result.model.filter(
            (selectedWorker) => !this.item.Workers.some((user) => user.id === selectedWorker.id)
          );
          if (selectedWorkers?.length) {
            this.item = {
              ...this.item,
              Workers: [...this.item.Workers, ...selectedWorkers]
            };
            this.cdr.detectChanges();
          }
        }
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
