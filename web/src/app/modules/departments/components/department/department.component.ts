import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, Observable, combineLatest } from 'rxjs';

import { Store, select } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import { AppState } from '@/core/reducers';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import {
  EDIT_PRIVILEGES,
  ACTION_LABELS,
  THEME_PALETTE,
  CONSTANTS,
  MAT_BUTTON,
  RoutingDataConstants
} from '@/shared/constants';
import { DynamicForm } from '@/shared/models';
import { UsersDialogComponent, User } from '@/modules/users';
import { Department } from '../../models';
import { updateDepartmentRequested, changeIsEditingState } from '../../store/department.actions';
import { selectIsEditing } from '../../store/department.selectors';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';
import { DialogDataModel, DialogWithTwoButtonModel, DialogResultModel } from '@/shared/models';
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

  departmentFormJson: DynamicForm;
  department: Department;
  departmentInitial: Department;
  departmentFormValues: Department;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.departmentFormJson = this.route.snapshot.data[RoutingDataConstants.FORM_JSON];
    this.departmentInitial = cloneDeep(this.route.snapshot.data[RoutingDataConstants.DEPARTMENT]);
    // TODO: @IMalaniak add plan directly from the store
    this.department = cloneDeep(this.route.snapshot.data[RoutingDataConstants.DEPARTMENT]);
  }

  onClickEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: true }));
  }

  onClickCancelEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: false }));
    this.department = cloneDeep(this.departmentInitial);
  }

  departmentFormValueChanges(formVal: Department): void {
    this.departmentFormValues = { ...this.departmentFormValues, ...formVal };
  }

  addManagerDialog(): void {
    // TODO: @ArseniiIrod, @IMalaniak implement logic with selected user
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_MANAGER));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.succession) {
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
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.succession) {
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
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_UPDATE_DEPARTMENT_CONFIRM);
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () => {
      this.store$.dispatch(updateDepartmentRequested({ department: { ...this.department, ...this.departmentFormValues } }));
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
