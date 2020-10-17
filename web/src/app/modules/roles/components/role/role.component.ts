import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Role, Privilege } from '../../models';
import { UsersDialogComponent } from '@/modules/users/components/dialog/users-dialog.component';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { cloneDeep } from 'lodash';
import { updateRoleRequested, changeIsEditingState } from '../../store/role.actions';
import { User } from '@/modules/users';
import { selectIsEditing } from '../../store/role.selectors';
import {
  EDIT_PRIVILEGES,
  COLUMN_NAMES,
  COLUMN_LABELS,
  ACTION_LABELS,
  THEME_PALETTE,
  MAT_BUTTON,
  CONSTANTS
} from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/core/services/dialog';
import { DialogWithTwoButtonModel } from '@/shared/models/modal/dialog-with-two-button.model';
import { DialogResultModel } from '@/shared/models/modal/dialog-result.model';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { DialogType } from '@/shared/models';
import { DialogSizeService } from '@/shared/services';

@Component({
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent implements OnInit, OnDestroy {
  editForm$: Observable<boolean> = this.store$.pipe(select(selectIsEditing));
  canEditRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.ROLE)));

  role: Role;
  roleInitial: Role;

  themePalette = THEME_PALETTE;
  matButtonType = MAT_BUTTON;
  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  displayedColumns: COLUMN_NAMES[] = [
    COLUMN_NAMES.TITLE,
    COLUMN_NAMES.VIEW,
    COLUMN_NAMES.ADD,
    COLUMN_NAMES.EDIT,
    COLUMN_NAMES.DELETE
  ];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private dialogSizeService: DialogSizeService
  ) { }

  ngOnInit(): void {
    this.getRoleData();
  }

  getRoleData(): void {
    this.role = cloneDeep(this.route.snapshot.data['role']);
    this.roleInitial = cloneDeep(this.route.snapshot.data['role']);
  }

  addParticipantDialog(): void {
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_USERS));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.succession) {
          const selectedUsers: User[] = result.model.filter(
            (selectedUser) => !this.role.Users.some((user) => user.id === selectedUser.id)
          );
          if (selectedUsers?.length) {
            this.role.Users = [...this.role.Users, ...selectedUsers];
            this.cdr.detectChanges();
          }
        }
      });

    // const userC = dialogRef.componentInstance.usersComponent;

    // dialogRef
    //   .afterOpened()
    //   .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$), delay(300))
    //   .subscribe(() => {
    //     userC.users
    //       .filter((user) => this.role.Users.some((rUser) => rUser.id === user.id))
    //       ?.forEach((selectedParticipant) => {
    //         userC.selection.select(selectedParticipant);
    //       });
    //   });
  }

  addPrivilegeDialog(): void {
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_PRIVILEGES));

    this.dialogService
      .open(PrivilegesDialogComponent, dialogDataModel, this.dialogSizeService.getSize(DialogType.STANDART))
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<Privilege[]>) => {
        if (result && result.succession) {
          const selectedPrivileges: Privilege[] = result.model
            .filter(
              (selectedPrivilege) => !this.role.Privileges.some((rPrivilege) => rPrivilege.id === selectedPrivilege.id)
            )
            ?.map((selectedPrivilege) => {
              return {
                ...selectedPrivilege,
                RolePrivilege: {
                  add: false,
                  view: false,
                  edit: false,
                  delete: false
                }
              };
            });

          if (selectedPrivileges?.length) {
            this.role.Privileges = [...this.role.Privileges, ...selectedPrivileges];
            this.cdr.detectChanges();
          }
        }
      });

    // const privilegesC = dialogRef.componentInstance.privilegesComponent;

    // dialogRef
    //   .afterOpened()
    //   .pipe(takeUntil(this.unsubscribe), skipUntil(privilegesC.isLoading$), delay(300))
    //   .subscribe(() => {
    //     privilegesC.privileges
    //       .filter((privilege) => this.role.Privileges.some((rPrivilege) => rPrivilege.id === privilege.id))
    //       ?.forEach((selectedPrivilege) => {
    //         privilegesC.selection.select(selectedPrivilege);
    //       });
    //   });
  }

  removePrivilege(privilegeId: number): void {
    this.role = { ...this.role, Privileges: this.role.Privileges.filter((privilege) => privilege.id !== privilegeId) };
  }

  removeUser(userId: number): void {
    this.role = { ...this.role, Users: this.role.Users.filter((user) => user.id !== userId) };
  }

  onClickEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: true }));
    this.displayedColumns = [...this.displayedColumns, COLUMN_NAMES.ACTIONS];
  }

  onClickCancelEdit(): void {
    this.store$.dispatch(changeIsEditingState({ isEditing: false }));
    this.role = cloneDeep(this.roleInitial);
    this.disableEdit();
  }

  disableEdit(): void {
    this.displayedColumns = this.displayedColumns.filter((col) => col !== COLUMN_NAMES.ACTIONS);
  }

  updateRole(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_UPDATE_ROLE_CONFIRM);
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService
      .confirm(DialogConfirmComponent, dialogDataModel, () => {
        this.store$.dispatch(updateRoleRequested({ role: this.role }));
        this.disableEdit();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
