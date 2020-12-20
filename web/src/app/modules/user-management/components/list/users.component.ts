import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
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
import { ADD_PRIVILEGES, EDIT_PRIVILEGES, DELETE_PRIVILEGES, COLUMN_NAMES } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { DataColumn } from '@/shared/models/table/data-column.model';
import { selectUserPageLoading, selectUsersTotalCount } from '../../store';
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
  canAddUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.USER)));
  canEditUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.USER)));
  canDeleteUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.USER)));

  selection = new SelectionModel<User>(true, []); // TODO:
  dataSource: UsersDataSource = new UsersDataSource(this.store$);
  // users: User[]; TODO:

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

  displayedColumns: DataColumn[] = [
    DataColumn.createSequenceNumberColumn(),
    DataColumn.createColumn({ title: COLUMN_NAMES.AVATAR, hasSorting: false }),
    DataColumn.createColumn({ title: COLUMN_NAMES.LOGIN }),
    DataColumn.createLinkColumn({ title: COLUMN_NAMES.EMAIL }),
    DataColumn.createColumn({ title: COLUMN_NAMES.NAME }),
    DataColumn.createColumn({ title: COLUMN_NAMES.SURNAME }),
    DataColumn.createLinkColumn({ title: COLUMN_NAMES.PHONE }),
    DataColumn.createLinkColumn({ title: COLUMN_NAMES.DEPARTMENT, hasSorting: false }),
    DataColumn.createColumn({ title: COLUMN_NAMES.STATE }),
    DataColumn.createColumn({ title: COLUMN_NAMES.CREATED_AT }),
    DataColumn.createColumn({ title: COLUMN_NAMES.UPDATED_AT }),
    DataColumn.createActionsColumn()
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

  // TODO:
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.resultsLength;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.users.forEach(row => this.selection.select(row));
  // }

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
