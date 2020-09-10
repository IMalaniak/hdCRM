import { Component, AfterViewInit, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { Plan } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { PlansDataSource } from '../../services/plan.datasource';
import { selectPlansLoading, selectPlansTotalCount } from '../../store/plan.selectors';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { PageQuery, ToastMessageService, IItemsPerPage, pageSizeOptions } from '@/shared';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { deletePlan } from '../../store/plan.actions';
import { getItemsPerPageState } from '@/core/reducers/preferences.selectors';
import {
  DIALOG,
  SORT_DIRECTION,
  ADD_PRIVILEGES,
  EDIT_PRIVILEGES,
  DELETE_PRIVILEGES,
  COLUMN_NAMES
} from '@/shared/constants';

@Component({
  selector: 'plan-list',
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

  constructor(
    private router: Router,
    private store$: Store<AppState>,
    private toastMessageService: ToastMessageService
  ) {}

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
    this.router.navigate([`/planner/details/${id}`], {
      queryParams: { edit }
    });
  }

  deletePlan(id: number): void {
    this.toastMessageService
      .confirm(DIALOG.CONFIRM, 'Do you really want to delete plan? You will not be able to recover!')
      .then((result) => {
        if (result.value) {
          this.store$.dispatch(deletePlan({ id }));
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
