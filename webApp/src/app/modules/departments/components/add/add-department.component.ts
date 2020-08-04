import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersDialogComponent, User } from '@/modules/users';
import { Department } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { createDepartment } from '../../store/department.actions';
import { MediaqueryService } from '@/shared';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDepartmentComponent implements OnInit {
  department = {} as Department;
  departmentData: FormGroup;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private mediaQuery: MediaqueryService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.departmentData = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(2500)])
    });
    this.department.SubDepartments = [];
    this.department.Workers = [];
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
          .filter(user => this.department.Manager?.id === user.id)
          ?.forEach(selectedManager => {
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
          .filter(user => this.department.Workers.some(workers => workers.id === user.id))
          ?.forEach(selectedWorker => {
            userC.selection.select(selectedWorker);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedWorkers: User[] = result?.filter(
          selectedWorker => !this.department.Workers.some(user => user.id === selectedWorker.id)
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
    this.department = { ...this.department, Workers: this.department.Workers.filter(worker => worker.id !== userId) };
  }

  onClickSubmit() {
    this.store.dispatch(createDepartment({ department: { ...this.department, ...this.departmentData.value } }));
  }
}
