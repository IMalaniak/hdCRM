import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

import { UsersDialogComponent, User } from '@/modules/users';
import { Department } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { createDepartmentRequested } from '../../store/department.actions';
import { ACTION_LABELS, CONSTANTS, MAT_BUTTON } from '@/shared/constants';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
import { DialogService } from '@/core/services/dialog/dialog.service';

@Component({
  templateUrl: './add-department.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDepartmentComponent implements OnInit {
  department = {} as Department;
  departmentData: FormGroup;
  actionLabels = ACTION_LABELS;
  matButtonTypes = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store$: Store<AppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.buildDepartmentFormGroup();
    this.department.SubDepartments = [];
    this.department.Workers = [];
  }

  buildDepartmentFormGroup(): void {
    this.departmentData = this.fb.group({
      title: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(2500)])
    });
  }

  addManagerDialog(): void {
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_MANAGER));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.succession) {
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
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_WORKERS));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.succession) {
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
      createDepartmentRequested({ department: { ...this.department, ...this.departmentData.value } })
    );
  }
}
