import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material';
import { StageService } from '../../../_services';
import { Stage } from '../../../_models';
import { AddStageDialogComponent } from '../add-dialog/add-stage-dialog.component';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit {
  stages: Stage[];
  selectedStages: Stage[];
  notSelectedStages: Stage[];
  newStage: Stage;

  constructor(
    private stageService: StageService,
    private dialog: MatDialog
  ) {
    this.newStage = new Stage();
  }

  ngOnInit() {
    this.stageService.getStagesList().subscribe(stages => {
      this.stages = stages.map(stage => {
        stage.selected = false;
        return stage;
      });
      this.resetSelected();
    });
  }

  selectAll(event: MatCheckboxChange): void {
    for (const stage of this.stages) {
      stage.selected = event.checked;
    }
    this.resetSelected(false);
  }

  resetSelected(reset: boolean = true): void {
    const self = this;
    if (reset) {
      this.selectedStages = [];
      this.notSelectedStages = [...this.stages];
    } else {
      self.resetSelected();
      for (const role of this.stages) {
        if (role.selected) {
          this.selectedStages.push(role);
          this.notSelectedStages.splice(this.notSelectedStages.indexOf(role), 1);
        }
      }
    }
  }

  onStageCheck(stage: Stage): void {
    const i = this.selectedStages.indexOf(stage);
    if (i >= 0) {
      this.selectedStages.splice(i, 1);
      this.notSelectedStages.push(stage);
    } else {
      if (stage.selected) {
        this.selectedStages.push(stage);
        this.notSelectedStages.splice(this.notSelectedStages.indexOf(stage), 1);
      }
    }
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newStage.keyString = result;
        this.stageService.createStage(this.newStage).subscribe(
          stage => {
            swal({
              title: 'Stage created!',
              type: 'success',
              timer: 1500
            }).then(() => {
              this.stages.push(stage);
            });
          },
          error => {
            swal({
              title: 'Ooops, something went wrong!',
              type: 'error',
              timer: 1500
            });
          }
        );
      }
    });
  }
}