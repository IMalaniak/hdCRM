import { Component, AfterViewInit, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { Plan } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { PlansDataSource } from '../../services/plan.datasource';
import { selectPlansLoading, selectPlansTotalCount } from '../../store/plan.selectors';
import { MatPaginator } from '@angular/material/paginator';
import { tap, takeUntil } from 'rxjs/operators';
import { DialogDataModel, PageQuery } from '@/shared/models';
import {
  IItemsPerPage,
  pageSizeOptions,
  COLUMN_LABELS,
  ACTION_LABELS,
  THEME_PALETTE,
  MAT_BUTTON,
  RoutingConstants,
  CONSTANTS
} from '@/shared/constants';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { deletePlanRequested, changeIsEditingState } from '../../store/plan.actions';
import { getItemsPerPageState } from '@/core/reducers/preferences.selectors';
import { SORT_DIRECTION, ADD_PRIVILEGES, EDIT_PRIVILEGES, DELETE_PRIVILEGES, COLUMN_NAMES } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';
import { DialogService } from '@/core/services/dialog';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  templateUrl: './plan-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanListComponent implements AfterViewInit, OnDestroy {
  dataSource: PlansDataSource = new PlansDataSource(this.store$);
  loading$: Observable<boolean> = this.store$.pipe(select(selectPlansLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectPlansTotalCount));
  canAddPlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.PLAN)));
  canEditPlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.PLAN)));
  canDeletePlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.PLAN)));
  itemsPerPageState$: Observable<IItemsPerPage> = this.store$.pipe(select(getItemsPerPageState));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<Plan>(true, []);
  pageSizeOptions: number[] = pageSizeOptions;
  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  matButtonType = MAT_BUTTON;
  addPlanRoute = RoutingConstants.ROUTE_PLANNER_ADD;

  displayedColumns: COLUMN_NAMES[] = [
    COLUMN_NAMES.TITLE,
    COLUMN_NAMES.CREATOR,
    COLUMN_NAMES.STAGE,
    COLUMN_NAMES.PARTICIPANTS,
    COLUMN_NAMES.CREATED_AT,
    COLUMN_NAMES.UPDATED_AT,
    COLUMN_NAMES.DEADLINE,
    COLUMN_NAMES.ACTIONS
  ];
  private unsubscribe: Subject<void> = new Subject();

  constructor(private store$: Store<AppState>, private router: Router, private dialogService: DialogService) { }

  ngAfterViewInit(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        takeUntil(this.unsubscribe),
        tap(() => this.loadPlansPage())
      )
      .subscribe();

    this.loadPlansPage();
  }

  loadPlansPage(): void {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortIndex: this.sort.active,
      sortDirection: this.sort.direction || SORT_DIRECTION.ASC
    };

    this.dataSource.loadPlans(newPage);
  }

  onPlanSelect(id: number, edit: boolean = false): void {
    this.router.navigateByUrl(`${RoutingConstants.ROUTE_PLANNER_DETAILS}/${id}`);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deletePlan(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_PLAN_CONFIRM);
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService
      .confirm(DialogConfirmComponent, dialogDataModel, () => this.store$.dispatch(deletePlanRequested({ id })));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
