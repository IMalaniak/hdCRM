import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Department, User } from '@/_models';
import { UsersComponentDialogComponent } from '../../users/users.component';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { DepartmentService, LoaderService, AuthenticationService, PrivilegeService } from '@/_services';
import { takeUntil } from 'rxjs/operators';

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
    private loaderService: LoaderService,
    private authService: AuthenticationService,
    private privilegeService: PrivilegeService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.baseUrl = environment.baseUrl;
    this.editForm = false;
    this.showDataLoader = true;
   }

  ngOnInit() {
    this.authService.currentUser.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.appUser = user;
      this.editDepartmentPrivilege = this.privilegeService.isPrivileged(user, 'editDepartment');
    });

    this.getDepartmentData();
  }

  getDepartmentData(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.departmentService.getDepartment(id).pipe(takeUntil(this.unsubscribe)).subscribe(department => {
      this.department = department;
      this.departmentInitial = { ...department };
    });
  }

  get canEditDepartment(): boolean {
    return this.editDepartmentPrivilege || (this.appUser.id === this.department.managerId);
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.department = { ...this.departmentInitial };
  }

  openManagerDialog(): void {
    this.showDataLoader = false;
    const dialogRef = this.dialog.open(UsersComponentDialogComponent, {
      height: '80vh',
      data: {
        title: ['Select manager'],
      }
    });

    if (this.department.Manager) {
      const usersC = dialogRef.componentInstance.usersComponent;

      dialogRef.afterOpen().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.loaderService.isLoaded.pipe(takeUntil(this.unsubscribe)).subscribe(isLoaded => {
          if (isLoaded) {
          usersC.resetSelected(false);
          }
        });
      });
    }

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result) {
        this.department.Manager = result[0];
      }
    });
  }

  openWorkersDialog(): void {
    this.showDataLoader = false;
    const dialogRef = this.dialog.open(UsersComponentDialogComponent, {
      height: '80vh',
      data: {
        title: ['Select workers'],
      }
    });

    if (this.department.Workers) {
      const usersC = dialogRef.componentInstance.usersComponent;

      dialogRef.afterOpen().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.loaderService.isLoaded.pipe(takeUntil(this.unsubscribe)).subscribe(isLoaded => {
          if (isLoaded) {
            for (const participant of this.department.Workers) {
              usersC.sortedData.find((user, i) => {
                if (user.id === participant.id) {
                    usersC.sortedData[i].selected = true;
                    return true;
                }
              });
            }
            usersC.resetSelected(false);
          }
        });
      });
    }

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result) {
        this.department.Workers = result;
      }
    });
  }

  updateDepartment(): void {
    this.showDataLoader = true;
    if (this.department.Workers && this.department.Workers.length > 0) {
      this.department.Workers = this.department.Workers.map(user => {
        return<User> {
          id: user.id
        };
      });
    }

    if (this.department.Manager && this.department.Manager.id) {
      const manager = new User();
      manager.id = this.department.Manager.id;
      this.department.Manager = manager;
    }

    this.departmentService.updateDepartment(this.department).pipe(takeUntil(this.unsubscribe)).subscribe(
      department => {
        this.department = department;
        this.departmentInitial = { ...this.department };
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
    console.log('dep component ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
