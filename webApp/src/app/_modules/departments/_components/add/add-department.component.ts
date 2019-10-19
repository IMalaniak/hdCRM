import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UsersDialogComponent } from '@/_modules/users';
import { Department } from '../../_models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { CreateDepartment } from '../../store/department.actions';
import { MediaqueryService } from '@/_shared/services';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {
  department = new Department();

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private mediaQuery: MediaqueryService
  ) { 

  }

  ngOnInit() {
    this.department.SubDepartments = [];
    this.department.Workers = [];
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

  onClickSubmit() {
    this.store.dispatch(new CreateDepartment({department: this.department}));
  }

}
