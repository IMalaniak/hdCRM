import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Privilege } from '../../../models';
import { AddPrivilegeDialogComponent } from '../add-dialog/add-privilege-dialog.component';
import { Subject, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { allPrivilegesRequested, createPrivilege } from '@/modules/roles/store/privilege.actions';
import { selectAllPrivileges, selectPrivilegesLoading } from '@/modules/roles/store/privilege.selectors';
import { takeUntil, map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivilegesComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this.store.pipe(select(selectPrivilegesLoading));

  selection = new SelectionModel<Privilege>(true, []);
  privileges: Privilege[];
  resultsLength: number;
  displayedColumns: string[] = ['select', 'title', 'key'];

  private unsubscribe: Subject<void> = new Subject();

  constructor(private dialog: MatDialog, private store: Store<AppState>, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.dispatch(allPrivilegesRequested());
    this.store
      .pipe(
        takeUntil(this.unsubscribe),
        select(selectAllPrivileges),
        map((data: Privilege[]) => {
          this.resultsLength = data.length;
          return data;
        })
      )
      .subscribe(data => (this.privileges = data));
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.resultsLength;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.privileges.forEach(row => this.selection.select(row));
  }

  createPrivilegeDialog(): void {
    const dialogRef = this.dialog.open(AddPrivilegeDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: Privilege) => {
        if (result) {
          this.store.dispatch(createPrivilege({ privilege: result }));
          this.cdr.detectChanges(); // TODO: @ArseniiIrod, @IMalaniak check if detectChanges works correctly after fixing defect #258
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
