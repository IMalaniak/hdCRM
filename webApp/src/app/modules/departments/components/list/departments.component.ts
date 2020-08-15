import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DepartmentsDataSource } from '../../services';
import { PageQuery, ToastMessageService } from '@/shared';
import { AppState } from '@/core/reducers';
import { selectDepartmentsTotalCount, selectDepartmentsLoading } from '../../store/department.selectors';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { tap } from 'rxjs/operators';
import { deleteDepartment } from '../../store/department.actions';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentsComponent implements OnInit, AfterViewInit {
  dataSource: DepartmentsDataSource = new DepartmentsDataSource(this.store);
  loading$: Observable<boolean> = this.store.pipe(select(selectDepartmentsLoading));
  resultsLength$: Observable<number> = this.store.pipe(select(selectDepartmentsTotalCount));
  canAddDep$: Observable<boolean> = this.store.pipe(select(isPrivileged('department-add')));
  canEditDep$: Observable<boolean> = this.store.pipe(select(isPrivileged('department-edit')));
  canDeleteDep$: Observable<boolean> = this.store.pipe(select(isPrivileged('department-delete')));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['title', 'manager', 'workers', 'createdAt', 'updatedAt', 'actions'];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    const initialPage: PageQuery = {
      pageIndex: 0,
      pageSize: 5,
      sortIndex: 'id',
      sortDirection: 'asc'
    };
    this.dataSource.loadDepartments(initialPage);
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadDepartmentsPage())).subscribe();

    // TODO: @IMalaniak @ArseniiIrod check for other solution
    this.sort.sortChange.pipe(tap(() => this.loadDepartmentsPage())).subscribe();
  }

  loadDepartmentsPage(): void {
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

  deleteDepartment(id: number): void {
    this.toastMessageService
      .confirm('Are you sure?', 'Do you really want to delete department? You will not be able to recover!')
      .then(result => {
        if (result.value) {
          this.store.dispatch(deleteDepartment({ id }));
        }
      });
  }
}
