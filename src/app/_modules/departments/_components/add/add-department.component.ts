import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material';
import { UsersDialogComponent } from '@/_modules/users';
import { Department } from '../../_models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { CreateDepartment } from '../../store/department.actions';

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
    private dialog: MatDialog,
    private store: Store<AppState>
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

      // dialogRef.afterOpen().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      //   this.loaderService.isLoaded.pipe(takeUntil(this.unsubscribe)).subscribe(isLoaded => {
      //     if (isLoaded) {
      //     usersC.resetSelected(false);
      //     }
      //   });
      // });
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

      // TODO
      // dialogRef.afterOpen().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      //   this.loaderService.isLoaded.pipe(takeUntil(this.unsubscribe)).subscribe(isLoaded => {
      //     if (isLoaded) {
      //       for (const participant of this.department.Workers) {
      //         usersC.sortedData.find((user, i) => {
      //             if (user.id === participant.id) {
      //                 usersC.sortedData[i].selected = true;
      //                 return true;
      //             }
      //         });
      //       }
      //       usersC.resetSelected(false);
      //     }
      //   });
      // });
    }

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result && result.length > 0) {
        this.department.Workers = result;
      }
    });
  }

  onClickSubmit() {
    this.store.dispatch(new CreateDepartment({department: this.department}));
  }

}
