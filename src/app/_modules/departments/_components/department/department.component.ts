import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import Swal from 'sweetalert2';
import { takeUntil, map } from 'rxjs/operators';

import { Department } from '../../_models';
import { UsersDialogComponent, User } from '@/_modules/users';
import { Subject, Observable, combineLatest } from 'rxjs';
import { DepartmentService } from '../../_services';

import { AppState } from '@/core/reducers';

import { DepartmentSaved } from '../../store/department.actions';
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
    this.editDepartmentPrivilege$ = this.store.pipe(select(isPrivileged('editDepartment')));

    this.departmentInitial = new Department(this.route.snapshot.data['department']);
    this.department = new Department(this.route.snapshot.data['department']);
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
    return combine.pipe(
      map(res => (res[0] || (res[1].id === this.department.managerId)))
    );
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.department = {...this.route.snapshot.data['department']};
  }

  addManagerDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: ['Select manager'],
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result && result.length > 0) {
        this.department.Manager = result[0];
      }
    });
  }

  addWorkersDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: ['Select workers'],
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result && result.length > 0) {
        this.department.Workers = [...new Set([...this.department.Workers, ...result])];
      }
    });
  }

  updateDepartment(): void {
    this.departmentService.updateOne(this.department).pipe(takeUntil(this.unsubscribe)).subscribe(
      () => {
        const department: Update<Department> = {
          id: this.department.id,
          changes: this.department
        }
        this.store.dispatch(new DepartmentSaved({department}));
        this.editForm = false;
        Swal.fire({
          text: 'Department updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        Swal.fire({
          text: 'Ooops, something went wrong!',
          type: 'error',
        });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
