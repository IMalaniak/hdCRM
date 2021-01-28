import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { User } from '@/core/modules/user-api/shared';
import { deleteUser, inviteUsers, OnlineUserListRequested } from '@/core/modules/user-api/store';
import { isPrivileged, currentUser } from '@/core/modules/auth/store/auth.selectors';
import { IconsService } from '@/core/services';
import { DialogCreateEditModel, DialogDataModel, DialogMode, DialogType, DialogResultModel } from '@/shared/models';
import { RoutingConstants, CONSTANTS, UserState, BS_ICONS } from '@/shared/constants';
import { ADD_PRIVILEGES, EDIT_PRIVILEGES, DELETE_PRIVILEGES, COLUMN_KEYS } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { RowActionData, RowActionType, Column, IColumn } from '@/shared/models/table';
import { selectListDisplayModeIsPopup, selectUserPageLoading, selectUsersTotalCount } from '../../store';
import { UsersDataSource } from '../../dataSources';
import { InvitationDialogComponent } from '../invitation-dialog/invitation-dialog.component';

@Component({
  selector: 'users-component',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnDestroy {
  currentUser$: Observable<User> = this.store$.pipe(select(currentUser));
  loading$: Observable<boolean> = this.store$.pipe(select(selectUserPageLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectUsersTotalCount));
  isPopupDisplayMode$: Observable<boolean> = this.store$.pipe(select(selectListDisplayModeIsPopup));
  canAddUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.USER)));
  canEditUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.USER)));
  canDeleteUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.USER)));

  dataSource: UsersDataSource = new UsersDataSource(this.store$);

  userStates = UserState;
  listIcons: { [key: string]: BS_ICONS } = {
    matMenu: BS_ICONS.ThreeDotsVertical,
    add: BS_ICONS.PersonPlus,
    info: BS_ICONS.PersonSquare,
    activate: BS_ICONS.PersonCheck,
    archivate: BS_ICONS.Archive,
    disable: BS_ICONS.PersonX,
    edit: BS_ICONS.Pencil,
    delete: BS_ICONS.Trash
  };

  displayedColumns: IColumn[] = [
    Column.createSequenceNumberColumn(),
    Column.createCheckboxColumn(),
    Column.createColumn({ key: COLUMN_KEYS.AVATAR, hasSorting: false }),
    Column.createColumn({ key: COLUMN_KEYS.LOGIN }),
    Column.createLinkColumn({ key: COLUMN_KEYS.EMAIL }),
    Column.createColumn({ key: COLUMN_KEYS.NAME }),
    Column.createColumn({ key: COLUMN_KEYS.SURNAME }),
    Column.createLinkColumn({ key: COLUMN_KEYS.PHONE }),
    Column.createLinkColumn({ key: COLUMN_KEYS.DEPARTMENT, hasSorting: false }),
    Column.createColumn({ key: COLUMN_KEYS.STATE }),
    Column.createColumn({ key: COLUMN_KEYS.CREATED_AT }),
    Column.createColumn({ key: COLUMN_KEYS.UPDATED_AT }),
    Column.createActionsColumn()
  ];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private store$: Store<AppState>,
    private dialogService: DialogService,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([BS_ICONS.Archive, BS_ICONS.PersonSquare, BS_ICONS.PersonX]);
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
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.success) {
          this.store$.dispatch(inviteUsers({ users: result.model }));
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
  //     const serverResponse = {
  //       success: response.success,
  //       message: `User state was changed to: ${response.data.state}`
  //     };
  //     this.toastMessageService.snack(serverResponse);
  //   });
  // }

  onUserSelect(id: number, edit: boolean = false): void {
    this.router.navigate([`${RoutingConstants.ROUTE_USERS_DETAILS}/${id}`], {
      queryParams: { edit }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
