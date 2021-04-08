import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { User, USER_STATE } from '@/core/modules/user-api/shared';
import { deleteUser, inviteUsers, OnlineUserListRequested } from '@/core/modules/user-api/store';
import { isPrivileged, currentUser } from '@/core/modules/auth/store/auth.selectors';
import { IconsService } from '@/core/services';
import { DialogCreateEditModel, DialogDataModel, DialogMode, DialogType, IDialogResult } from '@/shared/models';
import { ROUTING, CONSTANTS, BS_ICON } from '@/shared/constants';
import { ADD_PRIVILEGE, EDIT_PRIVILEGE, DELETE_PRIVILEGE, COLUMN_KEY } from '@/shared/constants';
import { ListDisplayMode } from '@/shared/store';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { RowActionData, RowActionType, Column, IColumn } from '@/shared/models/table';
import {
  selectListDisplayMode,
  selectPreselectedUsersIds,
  selectUserPageLoading,
  selectUsersTotalCount
} from '../../store';
import { UsersDataSource } from '../../dataSources';
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
  displayMode$: Observable<ListDisplayMode> = this.store$.pipe(select(selectListDisplayMode));
  preselectedUsersIds$: Observable<number[]> = this.store$.pipe(select(selectPreselectedUsersIds));
  canAddUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGE.USER)));
  canEditUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGE.USER)));
  canDeleteUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGE.USER)));
  cardTitle$: Observable<string> = this.displayMode$.pipe(
    map((displayMode) => {
      switch (displayMode) {
        case ListDisplayMode.POPUP_MULTI_SELECTION:
          return CONSTANTS.TEXTS_SELECT_USERS;
        case ListDisplayMode.POPUP_SINGLE_SELECTION:
          return CONSTANTS.TEXTS_SELECT_USER;
        default:
          return CONSTANTS.TEXTS_USER_LIST;
      }
    })
  );
  displayCardButtons$: Observable<boolean> = combineLatest([this.canAddUser$, this.displayMode$]).pipe(
    map(([canAddUser, displayMode]) => canAddUser && displayMode === ListDisplayMode.DEFAULT)
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
    Column.createColumn({ key: COLUMN_KEY.AVATAR, hasSorting: false }),
    Column.createColumn({ key: COLUMN_KEY.LOGIN }),
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
    this.store$.dispatch(OnlineUserListRequested());
  }

  onRowAction(data: RowActionData<RowActionType>): void {
    switch (data.actionType) {
      case RowActionType.DETAILS:
        this.onUserSelect(data.id, false);
        break;
      case RowActionType.EDIT:
        this.onUserSelect(data.id, true);
        break;
      case RowActionType.DELETE:
        this.deleteUser(data.id);
        break;
      case RowActionType.SELECT:
        this.selectedUsersIds = data.ids;
        break;
    }
  }

  openInvitationDialog(): void {
    const dialogModel: DialogCreateEditModel = new DialogCreateEditModel(
      DialogMode.CREATE,
      CONSTANTS.TEXTS_INVITE_USERS,
      CONSTANTS.TEXTS_SEND_INVITATIONS
    );
    const dialogDataModel: DialogDataModel<DialogCreateEditModel> = { dialogModel };

    this.dialogService
      .open(InvitationDialogComponent, dialogDataModel, DialogType.STANDART)
      .afterClosed()
      .subscribe((result: IDialogResult<User[]>) => {
        if (result && result.success) {
          this.store$.dispatch(inviteUsers({ users: result.data }));
        }
      });
  }

  deleteUser(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_USER_CONFIRM);
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
    this.router.navigate([`${ROUTING.ROUTE_USERS_DETAILS}/${id}`], {
      queryParams: { edit }
    });
  }
}
