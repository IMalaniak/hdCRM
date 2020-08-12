import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
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
import { selectIsLoading, selectUsersTotalCount, selectAllUsers } from '../../store/user.selectors';
import { isPrivileged, currentUser } from '@/core/auth/store/auth.selectors';
import { deleteUser } from '../../store/user.actions';
import { InvitationDialogComponent } from '../../components/invitation-dialog/invitation-dialog.component';
import { PageQuery, MediaqueryService, ToastMessageService } from '@/shared';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUser$: Observable<User> = this.store.pipe(select(currentUser));
  loading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  resultsLength$: Observable<number> = this.store.pipe(select(selectUsersTotalCount));
  addUserPrivilege$: Observable<boolean> = this.store.pipe(select(isPrivileged('user-add')));
  editUserPrivilege$: Observable<boolean> = this.store.pipe(select(isPrivileged('user-edit')));
  deleteUserPrivilege$: Observable<boolean> = this.store.pipe(select(isPrivileged('user-delete')));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<User>(true, []);
  dataSource: UsersDataSource = new UsersDataSource(this.store);
  users: User[];
  displayedColumns: string[] = [
    'select',
    'avatar',
    'login',
    'email',
    'name',
    'surname',
    'phone',
    'dep',
    'state',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private userService: UserService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    const initialPage: PageQuery = {
      pageIndex: 0,
      pageSize: 5,
      sortIndex: 'id',
      sortDirection: 'asc'
    };
    this.dataSource.loadUsers(initialPage);
    this.store.pipe(takeUntil(this.unsubscribe), select(selectAllUsers)).subscribe(users => (this.users = users));
  }

  ngAfterViewInit(): void {
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadUsersPage()))
      .subscribe();
  }

  loadUsersPage(): void {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortIndex: this.sort.active,
      sortDirection: this.sort.direction || 'asc'
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
    this.toastMessageService
      .confirm('Are you sure?', 'Do you really want to delete user? You will not be able to recover!')
      .then(result => {
        if (result.value) {
          this.store.dispatch(deleteUser({ id }));
        }
      });
  }

  changeUserState(user: User, state: any): void {
    const userState = {} as User;
    userState.id = user.id;
    userState.StateId = state;
    this.userService.updateUserState(userState).subscribe(
      userData => {
        user.State = userData.State;
        this.toastMessageService.toast(`User state was changed to: ${state.keyString}`);
      },
      error => {
        this.toastMessageService.popup('Ooops, something went wrong!', 'error');
      }
    );
  }

  onUserSelect(id: number, edit: boolean = false): void {
    this.router.navigate([`/users/details/${id}`], {
      queryParams: { edit }
    });
  }

  // changeStateOfSelected(stateTitle: string = 'active'): void {
  //   let state;
  //   for (state of this.states) {
  //     if (state.keyString === stateTitle) {
  //       break;
  //     }
  //   }

  //   this.userService.changeStateOfSelected(this.selectedUsers, state).subscribe(
  //     response => {
  //       for (const user of this.selectedUsers) {
  //         const i = this.users.indexOf(user);
  //         this.users[i].selected = user.selected = false;
  //         this.users[i].StateId = user.StateId = state.id;
  //         this.users[i].State = user.State = state;
  //       }
  //       this.resetSelected();
  //       this.toastMessageService.toast('User state was changed to: ${state.keyString}');
  //
  //     },
  //     error => {
  //        this.toastMessageService.popup('Ooops, something went wrong!', 'error');
  //     }
  //   );
  // }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
