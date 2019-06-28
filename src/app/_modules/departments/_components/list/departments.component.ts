import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort } from '@angular/material';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';

import { DepartmentsDataSource } from '../../_services';

import { Department } from '../../_models';
import { PageQuery } from '@/core/_models';

import { AppState } from '@/core/reducers';

import { selectDepartmentsTotalCount, selectDepartmentsLoading } from '../../store/department.selectors';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit, AfterViewInit {
  addDepPrivilege$: Observable<boolean>;
  departments$: Observable<Department[]>;
  dataSource: DepartmentsDataSource;
  loading$: Observable<boolean>;
  resultsLength$: Observable<number>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['title', 'manager', 'workers', 'createdAt', 'updatedAt', 'actions'];

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.addDepPrivilege$ = this.store.pipe(select(isPrivileged('addDepartment')));
    this.loading$ = this.store.pipe(select(selectDepartmentsLoading));
    this.resultsLength$ = this.store.pipe(select(selectDepartmentsTotalCount));
    this.dataSource = new DepartmentsDataSource(this.store);

    const initialPage: PageQuery = {
      pageIndex: 0,
      pageSize: 5,
      sortIndex: 'id',
      sortDirection: 'asc'
    };

    this.dataSource.loadDepartments(initialPage);
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadDepartmentsPage())
      )
      .subscribe();

      // TODO: check for other solution
    this.sort.sortChange
        .pipe(
          tap(() => this.loadDepartmentsPage())
        )
        .subscribe();

  }

  loadDepartmentsPage() {
    const newPage: PageQuery = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortIndex: this.sort.active,
      sortDirection: this.sort.direction || 'asc'
    };

    this.dataSource.loadDepartments(newPage);

  }

  onDepSelect(id: number, edit: boolean = false): void {
    this.router.navigate([`/departments/details/${id}`], {
      queryParams: { edit }
    });
  }
}
