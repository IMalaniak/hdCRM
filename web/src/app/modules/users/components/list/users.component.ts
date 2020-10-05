import { Component, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, merge } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { UserService, UsersDataSource } from '../../services';
import { User } from '../../models';
import { AppState } from '@/core/reducers';
import { selectIsLoading, selectUsersTotalCount } from '../../store/user.selectors';
import { isPrivileged, currentUser } from '@/core/auth/store/auth.selectors';
import { deleteUser } from '../../store/user.actions';
import { InvitationDialogComponent } from '../../components/invitation-dialog/invitation-dialog.component';
import { MediaqueryService, ToastMessageService } from '@/shared/services';
import { PageQuery } from '@/shared/models';
import {
  IItemsPerPage,
  pageSizeOptions,
  ACTION_LABELS,
  COLUMN_LABELS,
  THEME_PALETTE,
  RoutingConstants,
  CONSTANTS,
  UserStates
} from '@/shared/constants';
import { getItemsPerPageState } from '@/core/reducers/preferences.selectors';
import {
  DIALOG,
  ADD_PRIVILEGES,
  EDIT_PRIVILEGES,
  DELETE_PRIVILEGES,
  SORT_DIRECTION,
  COLUMN_NAMES
} from '@/shared/constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnDestroy, AfterViewInit {
  currentUser$: Observable<User> = this.store$.pipe(select(currentUser));
  loading$: Observable<boolean> = this.store$.pipe(select(selectIsLoading));
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
  userStates = UserStates;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private userService: UserService,
    private store$: Store<AppState>,
    public dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private toastMessageService: ToastMessageService
  ) {}

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
      sortIndex: this.sort.active,
      sortDirection: this.sort.direction || SORT_DIRECTION.ASC
    };

    this.dataSource.loadUsers(newPage);
  }

  openInvitationDialog(): void {
    this.dialog.open(InvitationDialogComponent, {
      ...this.mediaQuery.smallPopupSize
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
    this.toastMessageService.confirm(DIALOG.CONFIRM, CONSTANTS.TEXTS_DELETE_USER_CONFIRM).then((result) => {
      if (result.value) {
        this.store$.dispatch(deleteUser({ id }));
      }
    });
  }

  changeUserState(user: User, state: UserStates): void {
    const userState = { id: user.id, state } as User;

    // TODO: @IMalaniak recreate this to store
    this.userService.updateUserState(userState).subscribe(
      (response) => {
        user = { ...user, state: response.data.state };
        this.toastMessageService.toast(`User state was changed to: ${response.data.state}`);
      },
      () => {
        this.toastMessageService.popup('Ooops, something went wrong!', 'error');
      }
    );
  }

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
