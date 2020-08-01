import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import Swal from 'sweetalert2';
import { takeUntil, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { Department } from '../../models';
import { UsersDialogComponent, User } from '@/modules/users';
import { Subject, Observable, combineLatest } from 'rxjs';
import { DepartmentService } from '../../services';
import { AppState } from '@/core/reducers';
import { departmentSaved } from '../../store/department.actions';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import { MediaqueryService } from '@/shared';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {
    this.editForm = false;
    this.showDataLoader = true;
  }

  ngOnInit() {
    this.appUser$ = this.store.pipe(select(currentUser));
    this.editDepartmentPrivilege$ = this.store.pipe(select(isPrivileged('department-edit')));

    this.departmentInitial = cloneDeep(this.route.snapshot.data['department']);
    this.department = cloneDeep(this.route.snapshot.data['department']);
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
      .subscribe((result: User[]) => {
        if (result?.length) {
          this.department = { ...this.department, Manager: { ...result[0] } };
          this.cdr.detectChanges();
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
      .subscribe((result: User[]) => {
        const selectedWorkers: User[] = result?.filter(
          selectedWorker => !this.department.Workers.some(user => user.id === selectedWorker.id)
        );

        if (selectedWorkers?.length) {
          this.department.Workers = [...this.department.Workers, ...selectedWorkers];
          this.cdr.detectChanges();
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
          this.department = cloneDeep(data);
          this.departmentInitial = cloneDeep(data);
          const department: Update<Department> = {
            id: this.department.id,
            changes: data
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
