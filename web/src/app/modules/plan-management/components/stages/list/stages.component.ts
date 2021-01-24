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
import { COLUMN_KEYS, COLUMN_LABELS, ACTION_LABELS, CONSTANTS, BS_ICONS } from '@/shared/constants';
import { DialogService } from '@/shared/services';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogResultModel } from '@/shared/models/dialog/dialog-result.model';
import { DialogCreateEditModel, DialogMode } from '@/shared/models';
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

  columns = COLUMN_KEYS;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  displayedColumns: COLUMN_KEYS[] = [COLUMN_KEYS.SELECT, COLUMN_KEYS.TITLE];
  addStageIcon = BS_ICONS.Plus;

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
    const dialogModel = new DialogCreateEditModel(DialogMode.CREATE, CONSTANTS.TEXTS_CREATE_STAGE, ACTION_LABELS.SAVE);
    const dialogDataModel: DialogDataModel<DialogCreateEditModel> = { dialogModel };

    this.dialogService
      .open(AddStageDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<string>) => {
        if (result && result.success) {
          const stage: Stage = { keyString: result.model } as Stage;
          this.store$.dispatch(createStage({ stage }));
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
