import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Plan } from '../../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { PlansDataSource } from '../../services/plan.datasource';
import { selectPlansLoading, selectPlansTotalCount } from '../../store/plan.selectors';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { PageQuery, ToastMessageService } from '@/shared';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { deletePlan } from '../../store/plan.actions';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanListComponent implements OnInit, AfterViewInit {
  dataSource: PlansDataSource = new PlansDataSource(this.store);
  loading$: Observable<boolean> = this.store.pipe(select(selectPlansLoading));
  resultsLength$: Observable<number> = this.store.pipe(select(selectPlansTotalCount));
  canAddPlan$: Observable<boolean> = this.store.pipe(select(isPrivileged('plan-add')));
  canEditPlan$: Observable<boolean> = this.store.pipe(select(isPrivileged('plan-edit')));
  canDeletePlan$: Observable<boolean> = this.store.pipe(select(isPrivileged('plan-delete')));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<Plan>(true, []);
  displayedColumns: string[] = [
    'title',
    'creator',
    'stage',
    'participants',
    'createdAt',
    'updatedAt',
    'deadline',
    'actions'
  ];

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    const initialPage: PageQuery = {
      pageIndex: 0,
      pageSize: 5,
      sortIndex: 'id',
      sortDirection: 'asc'
    };
    this.dataSource.loadPlans(initialPage);
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadPlansPage())).subscribe();

    // TODO: @IMalaniak, @ArseniiIrod check for other solution
    this.sort.sortChange.pipe(tap(() => this.loadPlansPage())).subscribe();
  }

  loadPlansPage(): void {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortIndex: this.sort.active,
      sortDirection: this.sort.direction || 'asc'
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
      .confirm('Are you sure?', 'Do you really want to delete plan? You will not be able to recover!')
      .then(result => {
        if (result.value) {
          this.store.dispatch(deletePlan({ id }));
        }
      });
  }
}
