import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { takeUntil, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { Department } from '../../models';
import { UsersDialogComponent, User } from '@/modules/users';
import { Subject, Observable, combineLatest } from 'rxjs';
import { DepartmentService } from '../../services';
import { AppState } from '@/core/reducers';
import { departmentSaved } from '../../store/department.actions';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import { MediaqueryService, ToastMessageService } from '@/shared';

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
    private cdr: ChangeDetectorRef,
    private toastMessageService: ToastMessageService
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

  addManagerDialog(): void {
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

  removeManager(): void {
    this.department = { ...this.department, Manager: null };
  }

  removeWorker(userId: number): void {
    this.department = { ...this.department, Workers: this.department.Workers.filter(worker => worker.id !== userId) };
  }

  updateDepartment(): void {
    this.toastMessageService
      .confirm('You are about to update department', 'Are you sure you want to update department details?')
      .then(result => {
        if (result.value) {
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
                this.toastMessageService.toast('Department updated!', 'success');
              },
              error => {
                this.toastMessageService.popup('Ooops, something went wrong!', 'error', 2500);
              }
            );
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
