import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { DynamicForm } from '@/shared/models';
import { UsersDialogComponent, User } from '@/modules/users';
import { Department } from '../../models';
import { createDepartmentRequested } from '../../store/department.actions';
import { DialogService } from '@/shared/services';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
import { ACTION_LABELS, CONSTANTS, MAT_BUTTON, RoutingDataConstants } from '@/shared/constants';

@Component({
  selector: 'add-department-component',
  templateUrl: './add-department.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDepartmentComponent implements OnInit {
  department: Department = {} as Department;
  departmentFormJson: DynamicForm;
  departmentFormValues: Department;

  actionLabels = ACTION_LABELS;
  matButtonTypes = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.departmentFormJson = this.route.snapshot.data[RoutingDataConstants.FORM_JSON];
    this.department.SubDepartments = [];
    this.department.Workers = [];
  }

  departmentFormValueChanges(formVal: Department): void {
    this.departmentFormValues = { ...this.departmentFormValues, ...formVal };
  }

  addManagerDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_MANAGER)
    };

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.success) {
          this.department = { ...this.department, Manager: { ...result.model[0] } };
          this.cdr.detectChanges();
        }
      });

    // const userComponent = dialogRef.componentInstance.usersComponent;

    // dialogRef
    //   .afterOpened()
    //   .pipe(takeUntil(this.unsubscribe), skipUntil(userComponent.loading$))
    //   .subscribe(() => {
    //     userComponent
    //       .filter((user) => this.department.Manager?.id === user.id)
    //       ?.forEach((selectedManager) => {
    //         userComponent.selection.select(selectedManager);
    //       });
    //   });
  }

  addWorkersDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_WORKERS)
    };

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.success) {
          const selectedWorkers: User[] = result.model.filter(
            (selectedWorker) => !this.department.Workers.some((user) => user.id === selectedWorker.id)
          );
          if (selectedWorkers?.length) {
            this.department.Workers = [...this.department.Workers, ...selectedWorkers];
            this.cdr.detectChanges();
          }
        }
      });

    // const userC = dialogRef.componentInstance.usersComponent;

    // dialogRef
    //   .afterOpened()
    //   .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$))
    //   .subscribe(() => {
    //     userC.users
    //       .filter((user) => this.department.Workers.some((workers) => workers.id === user.id))
    //       ?.forEach((selectedWorker) => {
    //         userC.selection.select(selectedWorker);
    //       });
    //   });
  }

  removeManager(): void {
    this.department = { ...this.department, Manager: null };
  }

  removeWorker(userId: number): void {
    this.department = { ...this.department, Workers: this.department.Workers.filter((worker) => worker.id !== userId) };
  }

  onClickSubmit() {
    this.store$.dispatch(
      createDepartmentRequested({ department: { ...this.department, ...this.departmentFormValues } })
    );
  }
}
