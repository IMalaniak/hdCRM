import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import Swal from 'sweetalert2';
import { takeUntil, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { Department } from '../../_models';
import { UsersDialogComponent, User } from '@/_modules/users';
import { Subject, Observable, combineLatest } from 'rxjs';
import { DepartmentService } from '../../_services';

import { AppState } from '@/core/reducers';

import { departmentSaved } from '../../store/department.actions';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import { MediaqueryService } from '@/_shared/services';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy {
  department: Department;
  appUser$: Observable<User>;
  departmentInitial: Department;
  showDataLoader: boolean;
  editForm: boolean;
  editDepartmentPrivilege$: Observable<boolean>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private mediaQuery: MediaqueryService
  ) {
    this.editForm = false;
    this.showDataLoader = true;
  }

  ngOnInit() {
    this.appUser$ = this.store.pipe(select(currentUser));
    this.editDepartmentPrivilege$ = this.store.pipe(select(isPrivileged('department-edit')));

    this.departmentInitial = new Department(cloneDeep(this.route.snapshot.data['department']));
    this.department = new Department(cloneDeep(this.route.snapshot.data['department']));
    this.canEditDepartment$.pipe(takeUntil(this.unsubscribe)).subscribe(canEdit => {
      if (canEdit) {
        const edit = this.route.snapshot.queryParams['edit'];
        if (edit) {
          this.editForm = JSON.parse(edit);
        }
      }
    });
  }

  get canEditDepartment$(): Observable<boolean> {
    // combine 2 observables and compare values => return boolean
    const combine = combineLatest([this.editDepartmentPrivilege$, this.appUser$]);
    return combine.pipe(map(([editPriv, appUser]) => editPriv || appUser.id === this.department.managerId));
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.department = cloneDeep(this.departmentInitial);
  }

  openManagerDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: ['Select manager']
      }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        if (result && result.length > 0) {
          this.department.Manager = result[0];
        }
      });
  }

  addWorkersDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: ['Select workers']
      }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        if (result && result.length > 0) {
          this.department.Workers = [...new Set([...this.department.Workers, ...result])];
        }
      });
  }

  removeWorker(userId: number): void {
    this.department.Workers = this.department.Workers.filter(worker => {
      return worker.id !== userId;
    });
  }

  updateDepartment(): void {
    this.departmentService
      .updateOne(this.department)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          this.department = new Department(cloneDeep(data));
          this.departmentInitial = new Department(cloneDeep(data));
          const department: Update<Department> = {
            id: this.department.id,
            changes: new Department(data)
          };
          this.store.dispatch(departmentSaved({ department }));
          this.editForm = false;
          Swal.fire({
            text: 'Department updated!',
            icon: 'success',
            timer: 6000,
            toast: true,
            showConfirmButton: false,
            position: 'bottom-end'
          });
        },
        error => {
          Swal.fire({
            text: 'Ooops, something went wrong!',
            icon: 'error'
          });
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
