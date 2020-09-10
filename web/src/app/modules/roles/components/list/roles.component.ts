import { Component, ViewChild, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, merge } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { RolesDataSource } from '../../services/role.datasource';
import { Role } from '../../models';
import { selectRolesTotalCount, selectRolesLoading } from '../../store/role.selectors';
import { PageQuery, ToastMessageService, IItemsPerPage, pageSizeOptions } from '@/shared';
import { deleteRoleRequested, changeIsEditingState } from '../../store/role.actions';
import { getItemsPerPageState } from '@/core/reducers/preferences.selectors';
import { DIALOG } from '@/shared/constants';

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnDestroy, AfterViewInit {
  dataSource: RolesDataSource = new RolesDataSource(this.store$);
  loading$: Observable<boolean> = this.store$.pipe(select(selectRolesLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectRolesTotalCount));
  canAddRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged('role-add')));
  canEditRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged('role-edit')));
  canDeleteRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged('role-delete')));
  itemsPerPageState$: Observable<IItemsPerPage> = this.store$.pipe(select(getItemsPerPageState));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<Role>(true, []);
  displayedColumns: string[] = ['select', 'title', 'users', 'privileges', 'createdAt', 'updatedAt', 'actions'];
  pageSizeOptions: number[] = pageSizeOptions;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store$: Store<AppState>,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}

  ngAfterViewInit(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        takeUntil(this.unsubscribe),
        tap(() => this.loadRolesPage())
      )
      .subscribe();

    this.loadRolesPage();
  }

  loadRolesPage(): void {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortIndex: this.sort.active,
      sortDirection: this.sort.direction || 'asc'
    };

    this.dataSource.loadRoles(newPage);
  }

  onRoleSelect(id: number, edit: boolean = false): void {
    this.router.navigate([`/roles/details/${id}`]);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deleteRole(id: number): void {
    this.toastMessageService
      .confirm(DIALOG.CONFIRM, 'Do you really want to delete role? You will not be able to recover!')
      .then((result) => {
        if (result.value) {
          this.store$.dispatch(deleteRoleRequested({ id }));
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
