import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { takeUntil, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { Department } from '../../models';
import { UsersDialogComponent, User } from '@/modules/users';
import { Subject, Observable, combineLatest } from 'rxjs';
import { AppState } from '@/core/reducers';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import { MediaqueryService, ToastMessageService } from '@/shared/services';
import { updateDepartmentRequested, changeIsEditingState } from '../../store/department.actions';
import { selectIsEditing } from '../../store/department.selectors';
import { EDIT_PRIVILEGES, DIALOG, ACTION_LABELS, THEME_PALETTE, CONSTANTS, MAT_BUTTON } from '@/shared/constants';
import { DynamicForm } from '@/shared/models';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';

@Component({
  selector: 'department',
  templateUrl: './department.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentComponent implements OnInit, OnDestroy {
  editForm$: Observable<boolean> = this.store$.pipe(select(selectIsEditing));
  canEditDepartment$: Observable<boolean> = combineLatest([
    this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.DEPARTMENT))),
    this.store$.pipe(select(currentUser))
  ]).pipe(map(([editPriv, appUser]) => editPriv || appUser.id === this.department.managerId));
  departmentFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName('department')));

  department: Department;
  departmentInitial: Department;
  departmentFormValues: Department;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store$: Store<AppState>,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: 'department' }));
    this.departmentInitial = cloneDeep(this.route.snapshot.data['department']);
    // TODO: @IMalaniak add plan directly from the store
    this.department = cloneDeep(this.route.snapshot.data['department']);
  }

  onClickEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: true }));
  }

  onClickCancelEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: false }));
    this.department = cloneDeep(this.departmentInitial);
  }

  departmentFormValueChanges(formVal: User): void {
    this.departmentFormValues = { ...this.departmentFormValues, ...formVal };
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

  updateDepartment(): void {
    this.toastMessageService.confirm(DIALOG.CONFIRM, CONSTANTS.TEXTS_UPDATE_DEPARTMENT_CONFIRM).then((result) => {
      if (result.value) {
        this.store$.dispatch(
          updateDepartmentRequested({ department: { ...this.department, ...this.departmentFormValues } })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
