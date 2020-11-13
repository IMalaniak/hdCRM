import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MediaqueryService, ToastMessageService } from '@/shared/services';
import { Department } from '@/modules/departments/models';
import { User, UsersDialogComponent } from '@/modules/users';
import { TemplatesViewDetailsComponent } from '@/shared/components/templates';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';

@Component({
  selector: 'templates-department-view',
  templateUrl: './templates-department-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesDepartmentViewComponent
  extends TemplatesViewDetailsComponent<Department>
  implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    protected store$: Store<AppState>,
    protected toastMessageService: ToastMessageService,
    private dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {
    super(store$, toastMessageService);
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
          this.item = { ...this.item, Manager: { ...result[0] } };
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
          (selectedWorker) => !this.item.Workers.some((user) => user.id === selectedWorker.id)
        );

        if (selectedWorkers?.length) {
          this.item.Workers = [...this.item.Workers, ...selectedWorkers];
          this.cdr.detectChanges();
        }
      });
  }

  removeManager(): void {
    this.item = { ...this.item, Manager: null };
  }

  removeWorker(userId: number): void {
    this.item = { ...this.item, Workers: this.item.Workers.filter((worker) => worker.id !== userId) };
  }

  cardTitle(): string {
    return this.isCreatePage ? 'Create department' : this.item.title;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
