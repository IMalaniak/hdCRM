import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { Privilege } from '@/core/modules/role-api/shared';
import {
  selectPrivilegesLoading,
  allPrivilegesRequested,
  selectAllPrivileges,
  createPrivilegeRequested
} from '@/core/modules/role-api/store/privilege';
import { COLUMN_NAMES, COLUMN_LABELS, ACTION_LABELS, CONSTANTS, BS_ICONS } from '@/shared/constants';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogService } from '@/shared/services';
import { DialogMode } from '@/shared/models/dialog/dialog-mode.enum';
import { DialogResultModel } from '@/shared/models/dialog/dialog-result.model';
import { DialogCreateEditModel, DialogType } from '@/shared/models';
import { AddPrivilegeDialogComponent } from '../add-dialog/add-privilege-dialog.component';

@Component({
  selector: 'privileges-component',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss']
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
  addPrivilegeIcon = BS_ICONS.Plus;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store$: Store<AppState>, private dialogService: DialogService) {}

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
      ACTION_LABELS.SUBMIT
    );
    const dialogDataModel: DialogDataModel<DialogCreateEditModel> = { dialogModel };

    this.dialogService
      .open(AddPrivilegeDialogComponent, dialogDataModel, DialogType.STANDART)
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
