import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import { Store, select } from '@ngrx/store';
import { Stage } from '../../../models';
import { AddStageDialogComponent } from '../add-dialog/add-stage-dialog.component';
import { AppState } from '@/core/reducers';
import { allStagesRequestedFromDialogWindow, createStage } from '@/modules/planner/store/stage.actions';
import { selectAllStages, selectStagesLoading } from '@/modules/planner/store/stage.selectors';
import { COLUMN_NAMES, COLUMN_LABELS, ACTION_LABELS, CONSTANTS } from '@/shared/constants';
import { DialogService } from '@/core/services/dialog';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { ModalDialogResult } from '@/shared/models/modal/modal-dialog-result.model';
import { DialogCreateEditModel, DialogMode } from '@/shared/models';

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

  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  displayedColumns: COLUMN_NAMES[] = [COLUMN_NAMES.SELECT, COLUMN_NAMES.TITLE];

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
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService
      .open(AddStageDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: ModalDialogResult<string>) => {
        if (result && result.result) {
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
