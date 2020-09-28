import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { Observable, merge, Subject } from 'rxjs';
import { DepartmentsDataSource } from '../../services';
import { ToastMessageService } from '@/shared/services';
import { PageQuery } from '@/shared/models';
import {
  IItemsPerPage,
  pageSizeOptions,
  COLUMN_LABELS,
  ACTION_LABELS,
  THEME_PALETTE,
  RoutingConstants,
  MAT_BUTTON,
  CONSTANTS
} from '@/shared/constants';
import { AppState } from '@/core/reducers';
import { selectDepartmentsTotalCount, selectDepartmentsLoading } from '../../store/department.selectors';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { tap, takeUntil } from 'rxjs/operators';
import { deleteDepartmentRequested, changeIsEditingState } from '../../store/department.actions';
import { getItemsPerPageState } from '@/core/reducers/preferences.selectors';
import {
  ADD_PRIVILEGES,
  EDIT_PRIVILEGES,
  DELETE_PRIVILEGES,
  DIALOG,
  SORT_DIRECTION,
  COLUMN_NAMES
} from '@/shared/constants';

@Component({
  selector: 'departments',
  templateUrl: './departments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentsComponent implements AfterViewInit, OnDestroy {
  dataSource: DepartmentsDataSource = new DepartmentsDataSource(this.store$);
  loading$: Observable<boolean> = this.store$.pipe(select(selectDepartmentsLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectDepartmentsTotalCount));
  canAddDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.DEPARTMENT)));
  canEditDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.DEPARTMENT)));
  canDeleteDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.DEPARTMENT)));
  itemsPerPageState$: Observable<IItemsPerPage> = this.store$.pipe(select(getItemsPerPageState));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  matButtonTypes = MAT_BUTTON;
  addDepartmentRoute = RoutingConstants.ROUTE_DEPARTMENTS_ADD;

  displayedColumns: COLUMN_NAMES[] = [
    COLUMN_NAMES.TITLE,
    COLUMN_NAMES.MANAGER,
    COLUMN_NAMES.WORKERS,
    COLUMN_NAMES.CREATED_AT,
    COLUMN_NAMES.UPDATED_AT,
    COLUMN_NAMES.ACTIONS
  ];
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
        tap(() => this.loadDepartmentsPage())
      )
      .subscribe();

    this.loadDepartmentsPage();
  }

  loadDepartmentsPage(): void {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortIndex: this.sort.active,
      sortDirection: this.sort.direction || SORT_DIRECTION.ASC
    };

    this.dataSource.loadDepartments(newPage);
  }

  onDepSelect(id: number, edit: boolean = false, ownerId: number = null): void {
    this.router.navigate([`${RoutingConstants.ROUTE_DEPARTMENTS_DETAILS}/${id}`], {
      queryParams: { edit, ownerId }
    });
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deleteDepartment(id: number): void {
    this.toastMessageService.confirm(DIALOG.CONFIRM, CONSTANTS.TEXTS_DELETE_DEPARTMENT_CONFIRM).then((result) => {
      if (result.value) {
        this.store$.dispatch(deleteDepartmentRequested({ id }));
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
