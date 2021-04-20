import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { isPrivileged, currentUser } from '@core/modules/auth/store/auth.selectors';
import { User, USER_STATE } from '@core/modules/user-api/shared';
import { deleteUser, inviteUsers, onlineUserListRequested } from '@core/modules/user-api/store';
import { IconsService } from '@core/services';
import { AppState } from '@core/store';
import { DialogConfirmComponent } from '@shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { RoutingConstants, CommonConstants, BS_ICON } from '@shared/constants';
import { ADD_PRIVILEGE, EDIT_PRIVILEGE, DELETE_PRIVILEGE, COLUMN_KEY } from '@shared/constants';
import { DialogCreateEditModel, DialogDataModel, DIALOG_MODE, DIALOG_TYPE, IDialogResult } from '@shared/models';
import { DialogConfirmModel } from '@shared/models/dialog/dialog-confirm.model';
import { RowActionData, ROW_ACTION_TYPE, Column, IColumn } from '@shared/models/table';
import { DialogService } from '@shared/services';
import { LIST_DISPLAY_MODE } from '@shared/store';

import { UsersDataSource } from '../../dataSources';
import {
  selectListDisplayMode,
  selectPreselectedUsersIds,
  selectUserPageLoading,
  selectUsersTotalCount
} from '../../store';
import { InvitationDialogComponent } from '../invitation-dialog/invitation-dialog.component';

@Component({
  selector: 'users-component',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  currentUser$: Observable<User> = this.store$.pipe(select(currentUser));
  loading$: Observable<boolean> = this.store$.pipe(select(selectUserPageLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectUsersTotalCount));
  displayMode$: Observable<LIST_DISPLAY_MODE> = this.store$.pipe(select(selectListDisplayMode));
  preselectedUsersIds$: Observable<number[]> = this.store$.pipe(select(selectPreselectedUsersIds));
  canAddUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGE.USER)));
  canEditUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGE.USER)));
  canDeleteUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGE.USER)));
  cardTitle$: Observable<string> = this.displayMode$.pipe(
    map((displayMode) => {
      switch (displayMode) {
        case LIST_DISPLAY_MODE.POPUP_MULTI_SELECTION:
          return CommonConstants.TEXTS_SELECT_USERS;
        case LIST_DISPLAY_MODE.POPUP_SINGLE_SELECTION:
          return CommonConstants.TEXTS_SELECT_USER;
        default:
          return CommonConstants.TEXTS_USER_LIST;
      }
    })
  );
  displayCardButtons$: Observable<boolean> = combineLatest([this.canAddUser$, this.displayMode$]).pipe(
    map(([canAddUser, displayMode]) => canAddUser && displayMode === LIST_DISPLAY_MODE.DEFAULT)
  );

  dataSource: UsersDataSource = new UsersDataSource(this.store$);

  userStates = USER_STATE;
  listIcons: { [key: string]: BS_ICON } = {
    matMenu: BS_ICON.ThreeDotsVertical,
    add: BS_ICON.PersonPlus,
    info: BS_ICON.PersonSquare,
    activate: BS_ICON.PersonCheck,
    archivate: BS_ICON.Archive,
    disable: BS_ICON.PersonX,
    edit: BS_ICON.Pencil,
    delete: BS_ICON.Trash
  };

  displayedColumns: IColumn[] = [
    Column.createSequenceNumberColumn(),
    Column.createCheckboxColumn(),
    Column.createColumn({ key: COLUMN_KEY.PICTURE, hasSorting: false }),
    Column.createLinkColumn({ key: COLUMN_KEY.EMAIL }),
    Column.createColumn({ key: COLUMN_KEY.NAME }),
    Column.createColumn({ key: COLUMN_KEY.SURNAME }),
    Column.createLinkColumn({ key: COLUMN_KEY.PHONE }),
    Column.createLinkColumn({ key: COLUMN_KEY.DEPARTMENT, hasSorting: false }),
    Column.createColumn({ key: COLUMN_KEY.STATE }),
    Column.createColumn({ key: COLUMN_KEY.CREATED_AT }),
    Column.createColumn({ key: COLUMN_KEY.UPDATED_AT }),
    Column.createActionsColumn()
  ];

  selectedUsersIds: number[];

  constructor(
    private router: Router,
    private store$: Store<AppState>,
    private dialogService: DialogService,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([BS_ICON.Archive, BS_ICON.PersonSquare, BS_ICON.PersonX]);
    this.store$.dispatch(onlineUserListRequested());
  }

  onRowAction(data: RowActionData<ROW_ACTION_TYPE>): void {
    switch (data.actionType) {
      case ROW_ACTION_TYPE.DETAILS:
        this.onUserSelect(data.id, false);
        break;
      case ROW_ACTION_TYPE.EDIT:
        this.onUserSelect(data.id, true);
        break;
      case ROW_ACTION_TYPE.DELETE:
        this.deleteUser(data.id);
        break;
      case ROW_ACTION_TYPE.SELECT:
        this.selectedUsersIds = data.ids;
        break;
    }
  }

  openInvitationDialog(): void {
    const dialogModel: DialogCreateEditModel = new DialogCreateEditModel(
      DIALOG_MODE.CREATE,
      CommonConstants.TEXTS_INVITE_USERS,
      CommonConstants.TEXTS_SEND_INVITATIONS
    );
    const dialogDataModel: DialogDataModel<DialogCreateEditModel> = { dialogModel };

    this.dialogService
      .open(InvitationDialogComponent, dialogDataModel, DIALOG_TYPE.STANDART)
      .afterClosed()
      .subscribe((result: IDialogResult<User[]>) => {
        if (result && result.success) {
          this.store$.dispatch(inviteUsers({ users: result.data }));
        }
      });
  }

  deleteUser(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CommonConstants.TEXTS_DELETE_USER_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () => this.store$.dispatch(deleteUser({ id })));
  }

  // TODO: @IMalaniak recreate this to store
  // changeUserState(user: User, state: UserState): void {
  //   const userState = { id: user.id, state } as User;

  //   this.userService.updateUserState(userState).subscribe((response: ItemApiResponse<User>) => {
  //     this.toastMessageService.success(`User state was changed to: ${response.data.state}`);
  //   });
  // }

  onUserSelect(id: number, edit: boolean = false): void {
    this.router.navigate([`${RoutingConstants.ROUTE_USERS_DETAILS}/${id}`], {
      queryParams: { edit }
    });
  }
}
