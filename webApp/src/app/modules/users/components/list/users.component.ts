import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { UserService, UsersDataSource } from '../../services';
import { User } from '../../models';

import { AppState } from '@/core/reducers';
import { selectIsLoading, selectUsersTotalCount } from '../../store/user.selectors';
import { isPrivileged, currentUser } from '@/core/auth/store/auth.selectors';
import { deleteUser } from '../../store/user.actions';
import { InvitationDialogComponent } from '../../components/invitation-dialog/invitation-dialog.component';
import { PageQuery, MediaqueryService } from '@/shared';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUser$: Observable<User>;
  dataSource: UsersDataSource;
  selection = new SelectionModel<User>(true, []);
  deleteUserPrivilege$: Observable<boolean>;
  editUserPrivilege$: Observable<boolean>;
  addUserPrivilege$: Observable<boolean>;
  resultsLength$: Observable<number>;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
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
    private mediaQuery: MediaqueryService
  ) {}

  ngOnInit() {
    this.deleteUserPrivilege$ = this.store.pipe(select(isPrivileged('user-delete')));
    this.editUserPrivilege$ = this.store.pipe(select(isPrivileged('user-edit')));
    this.addUserPrivilege$ = this.store.pipe(select(isPrivileged('user-add')));

    this.loading$ = this.store.pipe(select(selectIsLoading));
    this.resultsLength$ = this.store.pipe(select(selectUsersTotalCount));

    this.currentUser$ = this.store.pipe(select(currentUser));

    this.dataSource = new UsersDataSource(this.store);

    const initialPage: PageQuery = {
      pageIndex: 0,
      pageSize: 5,
      sortIndex: 'id',
      sortDirection: 'asc'
    };

    this.dataSource.loadUsers(initialPage);
  }

  ngAfterViewInit() {
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadUsersPage()))
      .subscribe();
  }

  loadUsersPage() {
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
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete user? You will not be able to recover!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(result => {
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
        Swal.fire({
          text: `User state was changed to: ${state.keyString}`,
          icon: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        Swal.fire({
          text: 'Ooops, something went wrong!',
          icon: 'error',
          timer: 1500
        });
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
  //       Swal.fire({
  //         text: `User state was changed to: ${state.keyString}`,
  //         icon: 'success',
  //         timer: 6000,
  //         toast: true,
  //         showConfirmButton: false,
  //         position: 'bottom-end'
  //       });
  //     },
  //     error => {
  //       Swal.fire({
  //         text: 'Ooops, something went wrong!',
  //         icon: 'error',
  //         timer: 1500
  //       });
  //     }
  //   );
  // }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
