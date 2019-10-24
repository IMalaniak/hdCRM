import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Plan } from '../../_models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';

import { PlansDataSource } from '../../_services/plan.datasource';

import { selectPlansLoading, selectPlansTotalCount } from '../../store/plan.selectors';
import { MatPaginator, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { PageQuery } from '@/core/_models';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { DeletePlan } from '../../store/plan.actions';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit, AfterViewInit {
  addPlanPrivilege$: Observable<boolean>;
  editPlanPrivilege$: Observable<boolean>;
  deletePlanPrivilege$: Observable<boolean>;
  plans$: Observable<Plan[]>;
  dataSource: PlansDataSource;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns = ['title', 'creator', 'stage', 'participants', 'createdAt', 'updatedAt', 'deadline', 'actions'];
  resultsLength$: Observable<number>;

  selection = new SelectionModel<Plan>(true, []);

  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.addPlanPrivilege$ = this.store.pipe(select(isPrivileged('plan-add')));
    this.editPlanPrivilege$ = this.store.pipe(select(isPrivileged('plan-edit')));
    this.deletePlanPrivilege$ = this.store.pipe(select(isPrivileged('plan-delete')));

    this.loading$ = this.store.pipe(select(selectPlansLoading));
    this.resultsLength$ = this.store.pipe(select(selectPlansTotalCount));
    this.dataSource = new PlansDataSource(this.store);

    const initialPage: PageQuery = {
      pageIndex: 0,
      pageSize: 5,
      sortIndex: 'id',
      sortDirection: 'asc'
    };

    this.dataSource.loadPlans(initialPage);

  }

  ngAfterViewInit() {
      this.paginator.page
        .pipe(
          tap(() => this.loadPlansPage())
        )
        .subscribe();

        // TODO: check for other solution
      this.sort.sortChange
          .pipe(
            tap(() => this.loadPlansPage())
          )
          .subscribe();

  }

  loadPlansPage() {
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

  deletePlan(planId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete plan? You will not be able to recover!',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.store.dispatch(new DeletePlan({planId}));
      }
    });
  }

}
