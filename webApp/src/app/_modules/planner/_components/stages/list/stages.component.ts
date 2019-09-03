import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog} from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Stage } from '../../../_models';
import { AddStageDialogComponent } from '../add-dialog/add-stage-dialog.component';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { AllStagesRequestedFromDialogWindow, CreateStage } from '@/_modules/planner/store/plan.actions';
import { selectAllStages, selectStagesLoading } from '@/_modules/planner/store/plan.selectors';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit, OnDestroy {
  stages: Stage[];
  selection = new SelectionModel<Stage>(true, []);
  resultsLength: number;
  isLoading$: Observable<boolean>;

  displayedColumns = ['select', 'title'];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>
  ) { }

  ngOnInit() {

    this.store.dispatch(new AllStagesRequestedFromDialogWindow);

    this.isLoading$ = this.store.pipe(select(selectStagesLoading));

    this.store.pipe(
      takeUntil(this.unsubscribe),
      select(selectAllStages),
      map(data => {
        this.resultsLength = data.length;
        return data;
      })
    ).subscribe(data => this.stages = data);

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.resultsLength;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.stages.forEach(row => this.selection.select(row));
  }

  createStageDialog(): void {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      data: {
        keyString: new FormControl('', [
          Validators.required,
          Validators.minLength(4)
        ])
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result) {
        const newStage = new Stage({keyString: result});
        this.store.dispatch(new CreateStage({stage: newStage}));
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
