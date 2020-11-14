import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, Observable } from 'rxjs';

import { Privilege } from '../../../models';
import { AddPrivilegeDialogComponent } from '../add-dialog/add-privilege-dialog.component';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { allPrivilegesRequested, createPrivilegeRequested } from '@/modules/roles/store/privilege.actions';
import { selectAllPrivileges, selectPrivilegesLoading } from '@/modules/roles/store/privilege.selectors';
import { COLUMN_NAMES, COLUMN_LABELS, ACTION_LABELS, CONSTANTS } from '@/shared/constants';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogService } from '@/core/services/dialog/dialog.service';
import { DialogMode } from '@/shared/models/modal/dialog-mode.enum';
import { DialogResultModel } from '@/shared/models/modal/dialog-result.model';
import { DialogCreateEditModel, DialogType } from '@/shared/models';
import { DialogSizeService } from '@/shared/services';

@Component({
  selector: 'privileges-component',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivilegesComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this.store$.pipe(select(selectPrivilegesLoading));

  selection = new SelectionModel<Privilege>(true, []);
  privileges: Privilege[];
  resultsLength: number;

  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  displayedColumns: COLUMN_NAMES[] = [COLUMN_NAMES.SELECT, COLUMN_NAMES.TITLE, COLUMN_NAMES.KEY];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private dialogSizeService: DialogSizeService
  ) {}

  ngOnInit(): void {
    this.store$.dispatch(allPrivilegesRequested());
    this.store$
      .pipe(
        takeUntil(this.unsubscribe),
        select(selectAllPrivileges),
        map((data: Privilege[]) => {
          this.resultsLength = data.length;
          return data;
        })
      )
      .subscribe((data) => {
        this.privileges = data;
        this.cdr.detectChanges();
      });
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.resultsLength;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.privileges.forEach((row) => this.selection.select(row));
  }

  createPrivilegeDialog(): void {
    const dialogModel = new DialogCreateEditModel(
      DialogMode.CREATE,
      CONSTANTS.TEXTS_CREATE_PRIVILEGE,
      ACTION_LABELS.SUMBIT
    );
    const dialogDataModel: DialogDataModel<DialogCreateEditModel> = { dialogModel };

    this.dialogService
      .open(AddPrivilegeDialogComponent, dialogDataModel, this.dialogSizeService.getSize(DialogType.STANDART))
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<Privilege>) => {
        if (result && result.success) {
          this.store$.dispatch(createPrivilegeRequested({ privilege: result.model }));
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
