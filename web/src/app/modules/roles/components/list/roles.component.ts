import { Component, ViewChild, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subject, merge } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { RolesDataSource } from '../../services/role.datasource';
import { Role } from '../../models';
import { DialogDataModel, PageQuery } from '@/shared/models';
import { selectRolesTotalCount, selectRolesPageLoading } from '../../store/role.selectors';
import {
  IItemsPerPage,
  pageSizeOptions,
  ACTION_LABELS,
  COLUMN_LABELS,
  THEME_PALETTE,
  RoutingConstants,
  CONSTANTS
} from '@/shared/constants';
import { deleteRoleRequested, changeIsEditingState } from '../../store/role.actions';
import { getItemsPerPageState } from '@/core/reducers/preferences.selectors';
import { SORT_DIRECTION, ADD_PRIVILEGES, EDIT_PRIVILEGES, DELETE_PRIVILEGES, COLUMN_NAMES } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';

@Component({
  selector: 'roles-component',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnDestroy, AfterViewInit {
  dataSource: RolesDataSource = new RolesDataSource(this.store$);
  loading$: Observable<boolean> = this.store$.pipe(select(selectRolesPageLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectRolesTotalCount));
  canAddRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.ROLE)));
  canEditRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.ROLE)));
  canDeleteRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.ROLE)));
  itemsPerPageState$: Observable<IItemsPerPage> = this.store$.pipe(select(getItemsPerPageState));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<Role>(true, []);

  addRoleRoute = RoutingConstants.ROUTE_ROLES_ADD;
  themePalette = THEME_PALETTE;
  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  displayedColumns: COLUMN_NAMES[] = [
    COLUMN_NAMES.SELECT,
    COLUMN_NAMES.TITLE,
    COLUMN_NAMES.USERS,
    COLUMN_NAMES.PRIVILEGES,
    COLUMN_NAMES.CREATED_AT,
    COLUMN_NAMES.UPDATED_AT,
    COLUMN_NAMES.ACTIONS
  ];
  pageSizeOptions: number[] = pageSizeOptions;
  private unsubscribe: Subject<void> = new Subject();

  constructor(private store$: Store<AppState>, private router: Router, private dialogService: DialogService) {}

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
      sortIndex: this.sort.active || COLUMN_NAMES.ID,
      sortDirection: this.sort.direction || SORT_DIRECTION.ASC
    };

    this.dataSource.loadRoles(newPage);
  }

  onRoleSelect(id: number, edit: boolean = false): void {
    this.router.navigateByUrl(`${RoutingConstants.ROUTE_ROLES_DETAILS}/${id}`);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deleteRole(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_ROLE_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.store$.dispatch(deleteRoleRequested({ id }))
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
