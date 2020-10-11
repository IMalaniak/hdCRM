import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersDialogComponent, User } from '@/modules/users';
import { Department } from '../../models';
import { Observable, Subject } from 'rxjs';
import { takeUntil, skipUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { createDepartmentRequested } from '../../store/department.actions';
import { MediaqueryService } from '@/shared/services';
import { ACTION_LABELS, MAT_BUTTON } from '@/shared/constants';
import { DynamicForm } from '@/shared/models';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';

@Component({
  selector: 'add-department',
  templateUrl: './add-department.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDepartmentComponent implements OnInit {
  departmentFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName('department')));

  department: Department = {} as Department;
  departmentFormValues: Department;

  actionLabels = ACTION_LABELS;
  matButtonTypes = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef,
    private store$: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: 'department' }));
    this.department.SubDepartments = [];
    this.department.Workers = [];
  }

  departmentFormValueChanges(formVal: Department): void {
    this.departmentFormValues = { ...this.departmentFormValues, ...formVal };
  }

  addManagerDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: ['Select manager']
      }
    });

    const userC = dialogRef.componentInstance.usersComponent;

    dialogRef
      .afterOpened()
      .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$))
      .subscribe(() => {
        userC.users
          .filter((user) => this.department.Manager?.id === user.id)
          ?.forEach((selectedManager) => {
            userC.selection.select(selectedManager);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        if (result?.length) {
          this.department = { ...this.department, Manager: { ...result[0] } };
          this.cdr.detectChanges();
        }
      });
  }

  addWorkersDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: ['Select workers']
      }
    });

    const userC = dialogRef.componentInstance.usersComponent;

    dialogRef
      .afterOpened()
      .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$))
      .subscribe(() => {
        userC.users
          .filter((user) => this.department.Workers.some((workers) => workers.id === user.id))
          ?.forEach((selectedWorker) => {
            userC.selection.select(selectedWorker);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedWorkers: User[] = result?.filter(
          (selectedWorker) => !this.department.Workers.some((user) => user.id === selectedWorker.id)
        );

        if (selectedWorkers?.length) {
          this.department.Workers = [...this.department.Workers, ...selectedWorkers];
          this.cdr.detectChanges();
        }
      });
  }

  removeManager(): void {
    this.department = { ...this.department, Manager: null };
  }

  removeWorker(userId: number): void {
    this.department = { ...this.department, Workers: this.department.Workers.filter((worker) => worker.id !== userId) };
  }

  onClickSubmit() {
    this.store.dispatch(
      createDepartmentRequested({ department: { ...this.department, ...this.departmentFormValues } })
    );
  }
}
