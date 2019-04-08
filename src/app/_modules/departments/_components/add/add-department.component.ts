import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UsersDialogComponent, User } from '@/_modules/users';
import { LoaderService } from '@/_shared/services';
import { DepartmentService } from '../../_services';
import { Department } from '../../_models';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {
  department = new Department();
  baseUrl: string;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private departmentService: DepartmentService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) { 
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
  }

  addManagerDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
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

  addWorkersDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
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

  onClickSubmit() {
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

    this.departmentService.createDepartment(this.department).pipe(takeUntil(this.unsubscribe)).subscribe(
      data => {
        swal({
          title: 'Department created!',
          type: 'success',
          timer: 1500
        });
        this.router.navigate(['/departments']);
      },
      error => {
        swal({
          title: 'Ooops, something went wrong!',
          type: 'error',
          timer: 1500
        });
        this.router.navigate(['/departments/add']);
    });
  }

}
