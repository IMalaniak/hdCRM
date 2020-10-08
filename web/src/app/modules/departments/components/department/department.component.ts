import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, Observable, combineLatest } from 'rxjs';

import { cloneDeep } from 'lodash';
import { Department } from '../../models';
import { UsersDialogComponent, User } from '@/modules/users';
import { AppState } from '@/core/reducers';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import { updateDepartmentRequested, changeIsEditingState } from '../../store/department.actions';
import { selectIsEditing } from '../../store/department.selectors';
import { EDIT_PRIVILEGES, ACTION_LABELS, THEME_PALETTE, CONSTANTS, MAT_BUTTON } from '@/shared/constants';
import { DialogConfirmModal } from '@/shared/models/modal/dialog-question.model';
import { DialogDataModel, DialogWithTwoButtonModel, ModalDialogResult } from '@/shared/models';
import { DialogService } from '@/core/services/dialog';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  templateUrl: './department.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentComponent implements OnInit, OnDestroy {
  editForm$: Observable<boolean> = this.store$.pipe(select(selectIsEditing));
  canEditDepartment$: Observable<boolean> = combineLatest([
    this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.DEPARTMENT))),
    this.store$.pipe(select(currentUser))
  ]).pipe(map(([editPriv, appUser]) => editPriv || appUser.id === this.department.managerId));

  department: Department;
  departmentInitial: Department;
  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.departmentInitial = cloneDeep(this.route.snapshot.data['department']);
    this.department = cloneDeep(this.route.snapshot.data['department']);
  }

  onClickEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: true }));
  }

  onClickCancelEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: false }));
    this.department = cloneDeep(this.departmentInitial);
  }

  addManagerDialog(): void {
    // TODO: @ArseniiIrod, @IMalaniak implement logic with selected user
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_MANAGER));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: ModalDialogResult<User[]>) => {
        if (result && result.result) {
          this.department = { ...this.department, Manager: { ...result[0] } };
          this.cdr.detectChanges();
        }
      });
  }

  addWorkersDialog(): void {
    // TODO: @ArseniiIrod, @IMalaniak implement logic with selected users
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_WORKERS));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: ModalDialogResult<User[]>) => {
        if (result && result.result) {
          const selectedWorkers: User[] = result.model.filter(
            (selectedWorker) => !this.department.Workers.some((user) => user.id === selectedWorker.id)
          );

          if (selectedWorkers.length) {
            this.department.Workers = [...this.department.Workers, ...selectedWorkers];
            this.cdr.detectChanges();
          }
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
    const dialogModel: DialogConfirmModal = new DialogConfirmModal(CONSTANTS.TEXTS_UPDATE_DEPARTMENT_CONFIRM);
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService
      .confirm(DialogConfirmComponent, dialogDataModel)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: boolean) => {
        if (result) {
          this.store$.dispatch(updateDepartmentRequested({ department: this.department }));
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
