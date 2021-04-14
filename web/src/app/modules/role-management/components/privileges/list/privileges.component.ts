import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { Privilege } from '@core/modules/role-api/shared';
import {
  selectPrivilegesLoading,
  allPrivilegesRequested,
  selectAllPrivileges,
  createPrivilegeRequested
} from '@core/modules/role-api/store/privilege';
import { AppState } from '@core/store';
import { COLUMN_KEY, COLUMN_LABEL, ACTION_LABEL, CommonConstants, BS_ICON } from '@shared/constants';
import { DialogCreateEditModel, DIALOG_TYPE } from '@shared/models';
import { DialogDataModel } from '@shared/models/dialog/dialog-data.model';
import { DIALOG_MODE } from '@shared/models/dialog/dialog-mode.enum';
import { IDialogResult } from '@shared/models/dialog/dialog-result';
import { DialogService } from '@shared/services';

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

  columns = COLUMN_KEY;
  columnLabels = COLUMN_LABEL;
  actionLabels = ACTION_LABEL;
  displayedColumns: COLUMN_KEY[] = [COLUMN_KEY.SELECT, COLUMN_KEY.TITLE, COLUMN_KEY.KEY];
  addPrivilegeIcon = BS_ICON.Plus;

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
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.privileges.forEach((row) => this.selection.select(row));
    }
  }

  createPrivilegeDialog(): void {
    const dialogModel = new DialogCreateEditModel(
      DIALOG_MODE.CREATE,
      CommonConstants.TEXTS_CREATE_PRIVILEGE,
      ACTION_LABEL.SUBMIT
    );
    const dialogDataModel: DialogDataModel<DialogCreateEditModel> = { dialogModel };

    this.dialogService
      .open(AddPrivilegeDialogComponent, dialogDataModel, DIALOG_TYPE.STANDART)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: IDialogResult<Privilege>) => {
        if (result && result.success) {
          this.store$.dispatch(createPrivilegeRequested({ privilege: result.data }));
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
