import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, merge } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import swal from 'sweetalert2';

import { UserService, UsersDataSource } from '../../_services';
import { User } from '../../_models';

import { PageQuery } from '@/core/_models';

import { AppState } from '@/core/reducers';
import { selectUsersLoading, selectUsersTotalCount } from '../../store/user.selectors';
import { isPrivileged } from '@/core/auth/store/auth.selectors';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource: UsersDataSource;
  selection = new SelectionModel<User>(true, []);
  editUserPrivilege$: Observable<boolean>;
  addUserPrivilege$: Observable<boolean>;
  resultsLength$: Observable<number>;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['select', 'avatar', 'login', 'email', 'name', 'surname', 'phone', 'dep', 'state', 'createdAt', 'updatedAt', 'actions'];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private userService: UserService,
    private store: Store<AppState>
  ) {

  }

  ngOnInit() {
    this.editUserPrivilege$ = this.store.pipe(select(isPrivileged('editUser')));
    this.addUserPrivilege$ = this.store.pipe(select(isPrivileged('addUser')));

    this.loading$ = this.store.pipe(select(selectUsersLoading));
    this.resultsLength$ = this.store.pipe(select(selectUsersTotalCount));
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
      .pipe(
          tap(() => this.loadUsersPage())
      )
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

  changeUserState(user, state): void {
    const userState = new User();
    userState.id = user.id;
    userState.StateId = state;
    this.userService.updateUserState(userState).subscribe(
      userData => {
        user.State = userData.State;
        swal({
          text: `User state was changed to: ${state.keyString}`,
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
          text: 'Ooops, something went wrong!',
          type: 'error',
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
  //       swal({
  //         text: `User state was changed to: ${state.keyString}`,
  //         type: 'success',
  //         timer: 6000,
  //         toast: true,
  //         showConfirmButton: false,
  //         position: 'bottom-end'
  //       });
  //     },
  //     error => {
  //       swal({
  //         text: 'Ooops, something went wrong!',
  //         type: 'error',
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