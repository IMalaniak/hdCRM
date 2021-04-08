import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { Stage } from '@/core/modules/plan-api/shared';
import {
  selectStagesLoading,
  allStagesRequestedFromDialogWindow,
  selectAllStages,
  createStage
} from '@/core/modules/plan-api/store/stage';
import { COLUMN_KEY, COLUMN_LABEL, ACTION_LABEL, CONSTANTS, BS_ICON } from '@/shared/constants';
import { DialogService } from '@/shared/services';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { IDialogResult } from '@/shared/models/dialog/dialog-result';
import { DialogCreateEditModel, DIALOG_MODE } from '@/shared/models';
import { AddStageDialogComponent } from '../add-dialog/add-stage-dialog.component';

@Component({
  selector: 'stages-component',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StagesComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this.store$.pipe(select(selectStagesLoading));

  stages: Stage[];
  resultsLength: number;
  selection = new SelectionModel<Stage>(true, []);

  columns = COLUMN_KEY;
  columnLabels = COLUMN_LABEL;
  actionLabels = ACTION_LABEL;
  displayedColumns: COLUMN_KEY[] = [COLUMN_KEY.SELECT, COLUMN_KEY.TITLE];
  addStageIcon = BS_ICON.Plus;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store$: Store<AppState>, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.store$.dispatch(allStagesRequestedFromDialogWindow());
    this.store$
      .pipe(
        takeUntil(this.unsubscribe),
        select(selectAllStages),
        map((data) => {
          this.resultsLength = data.length;
          return data;
        })
      )
      .subscribe((data) => (this.stages = data));
  }

  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.resultsLength;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.stages.forEach((row) => this.selection.select(row));
  }

  createStageDialog(): void {
    const dialogModel = new DialogCreateEditModel(DIALOG_MODE.CREATE, CONSTANTS.TEXTS_CREATE_STAGE, ACTION_LABEL.SAVE);
    const dialogDataModel: DialogDataModel<DialogCreateEditModel> = { dialogModel };

    this.dialogService
      .open(AddStageDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: IDialogResult<string>) => {
        if (result && result.success) {
          const stage: Stage = { keyString: result.data } as Stage;
          this.store$.dispatch(createStage({ stage }));
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
