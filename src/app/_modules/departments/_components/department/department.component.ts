import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';

import { Department } from '../../_models';
import { UsersDialogComponent, User } from '@/_modules/users';
import { Subject } from 'rxjs';
import { DepartmentService } from '../../_services';

import { AppState } from '@/core/reducers';

import { DepartmentSaved } from '../../store/department.actions';
import { currentUser } from '@/core/auth/store/auth.selectors';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy {
  department: Department;
  appUser: User;
  departmentInitial: Department;
  showDataLoader: boolean;
  baseUrl: string;
  editForm: boolean;
  editDepartmentPrivilege: boolean;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    this.baseUrl = environment.baseUrl;
    this.editForm = false;
    this.showDataLoader = true;
   }

  ngOnInit() {
    this.store.pipe(
      select(currentUser),
      takeUntil(this.unsubscribe)
    ).subscribe(user => {
        this.appUser = user;
        // TODO:
        // this.editDepartmentPrivilege = this.privilegeService.isPrivileged(user, 'editDepartment');
    });

    // TODO: check
    this.departmentInitial = this.route.snapshot.data['department'];
    this.department = {...this.departmentInitial}
    if (this.canEditDepartment) {
      const edit = this.route.snapshot.queryParams['edit'];
      if (edit) {
        this.editForm = JSON.parse(edit);
      }
    }
  }

  get canEditDepartment(): boolean {
     return this.editDepartmentPrivilege || (this.appUser.id === this.department.managerId);
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.department = {...this.route.snapshot.data['department']};
  }

  openManagerDialog(): void {
    // TODO
    // this.showDataLoader = false;
    // const dialogRef = this.dialog.open(UsersDialogComponent, {
    //   height: '80vh',
    //   data: {
    //     title: 'Select manager',
    //   }
    // });

    // if (this.department.Manager) {
    //   const usersC = dialogRef.componentInstance.usersComponent;

    //   dialogRef.afterOpen().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
    //     this.loaderService.isLoaded.pipe(takeUntil(this.unsubscribe)).subscribe(isLoaded => {
    //       if (isLoaded) {
    //       usersC.resetSelected(false);
    //       }
    //     });
    //   });
    // }

    // dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
    //   if (result) {
    //     this.department.Manager = result[0];
    //   }
    // });
  }

  openWorkersDialog(): void {
    // TODO
    // this.showDataLoader = false;
    // const dialogRef = this.dialog.open(UsersDialogComponent, {
    //   height: '80vh',
    //   data: {
    //     title: 'Select workers',
    //   }
    // });

    // if (this.department.Workers) {
    //   const usersC = dialogRef.componentInstance.usersComponent;

    //   // TODO
    //   // dialogRef.afterOpen().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
    //   //   this.loaderService.isLoaded.pipe(takeUntil(this.unsubscribe)).subscribe(isLoaded => {
    //   //     if (isLoaded) {
    //   //       for (const participant of this.department.Workers) {
    //   //         usersC.sortedData.find((user, i) => {
    //   //           if (user.id === participant.id) {
    //   //               usersC.sortedData[i].selected = true;
    //   //               return true;
    //   //           }
    //   //         });
    //   //       }
    //   //       usersC.resetSelected(false);
    //   //     }
    //   //   });
    //   // });
    // }

    // dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
    //   if (result) {
    //     this.department.Workers = result;
    //   }
    // });
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
        swal({
          text: 'Department updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
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
