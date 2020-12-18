import { Component, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject, merge } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { getItemsPerPageState } from '@/core/store/preferences';
import { User } from '@/core/modules/user-api/shared';
import { deleteUser, inviteUsers, OnlineUserListRequested } from '@/core/modules/user-api/store';
import { isPrivileged, currentUser } from '@/core/modules/auth/store/auth.selectors';
import { IconsService } from '@/core/services';
import {
  DialogCreateEditModel,
  DialogDataModel,
  DialogMode,
  DialogType,
  DialogResultModel,
  PageQuery
} from '@/shared/models';
import {
  IItemsPerPage,
  pageSizeOptions,
  ACTION_LABELS,
  COLUMN_LABELS,
  THEME_PALETTE,
  RoutingConstants,
  CONSTANTS,
  UserState,
  BS_ICONS
} from '@/shared/constants';
import { ADD_PRIVILEGES, EDIT_PRIVILEGES, DELETE_PRIVILEGES, SORT_DIRECTION, COLUMN_NAMES } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { InvitationDialogComponent } from '../invitation-dialog/invitation-dialog.component';
import { UsersDataSource } from '../../dataSources';
import { selectUserPageLoading, selectUsersTotalCount } from '../../store';

@Component({
  selector: 'users-component',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnDestroy, AfterViewInit {
  currentUser$: Observable<User> = this.store$.pipe(select(currentUser));
  loading$: Observable<boolean> = this.store$.pipe(select(selectUserPageLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectUsersTotalCount));
  canAddUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.USER)));
  canEditUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.USER)));
  canDeleteUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.USER)));
  itemsPerPageState$: Observable<IItemsPerPage> = this.store$.pipe(select(getItemsPerPageState));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<User>(true, []);
  dataSource: UsersDataSource = new UsersDataSource(this.store$);
  pageSizeOptions: number[] = pageSizeOptions;
  users: User[];

  themePalette = THEME_PALETTE;
  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  displayedColumns: COLUMN_NAMES[] = [
    COLUMN_NAMES.SELECT,
    COLUMN_NAMES.AVATAR,
    COLUMN_NAMES.LOGIN,
    COLUMN_NAMES.EMAIL,
    COLUMN_NAMES.NAME,
    COLUMN_NAMES.SURNAME,
    COLUMN_NAMES.PHONE,
    COLUMN_NAMES.DEPARTMENT,
    COLUMN_NAMES.STATE,
    COLUMN_NAMES.CREATED_AT,
    COLUMN_NAMES.UPDATED_AT,
    COLUMN_NAMES.ACTIONS
  ];
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

  ngAfterViewInit(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        takeUntil(this.unsubscribe),
        tap(() => this.loadUsersPage())
      )
      .subscribe();

    this.loadUsersPage();
  }

  loadUsersPage(): void {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortIndex: this.sort.active || COLUMN_NAMES.ID,
      sortDirection: this.sort.direction || SORT_DIRECTION.ASC
    };

    this.dataSource.loadUsers(newPage);
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
