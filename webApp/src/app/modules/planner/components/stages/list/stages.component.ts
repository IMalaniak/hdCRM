import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Stage } from '../../../models';
import { AddStageDialogComponent } from '../add-dialog/add-stage-dialog.component';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { allStagesRequestedFromDialogWindow, createStage } from '@/modules/planner/store/stage.actions';
import { selectAllStages, selectStagesLoading } from '@/modules/planner/store/stage.selectors';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StagesComponent implements OnInit, OnDestroy {
  stages: Stage[];
  selection = new SelectionModel<Stage>(true, []);
  resultsLength: number;
  isLoading$: Observable<boolean>;

  displayedColumns = ['select', 'title'];

  private unsubscribe: Subject<void> = new Subject();

  constructor(private dialog: MatDialog, private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(allStagesRequestedFromDialogWindow());

    this.isLoading$ = this.store.pipe(select(selectStagesLoading));

    this.store
      .pipe(
        takeUntil(this.unsubscribe),
        select(selectAllStages),
        map(data => {
          this.resultsLength = data.length;
          return data;
        })
      )
      .subscribe(data => (this.stages = data));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.resultsLength;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.stages.forEach(row => this.selection.select(row));
  }

  createStageDialog(): void {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      data: {
        keyString: new FormControl('', [Validators.required, Validators.minLength(4)])
      }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        if (result) {
          const stage = { keyString: result } as Stage;
          this.store.dispatch(createStage({ stage }));
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
