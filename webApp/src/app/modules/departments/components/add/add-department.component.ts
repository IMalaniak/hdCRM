import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersDialogComponent, User } from '@/modules/users';
import { Department } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  removeWorker(id: number): void {
    // TODO: @ArseniiIrod, @IMalaniak add logic to remove worker
  }

  onClickSubmit() {
    this.store.dispatch(createDepartment({ department: { ...this.department, ...this.departmentData.value } }));
  }
}
