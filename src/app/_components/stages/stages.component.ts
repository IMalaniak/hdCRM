import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { StageService, TranslationsService } from '@/_services';
import { Stage } from '@/_models';

export interface DialogData {
  keyString: FormControl;
}

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit {
  dataLoaded: boolean;
  stages: Stage[];
  newStage: Stage;
  translations: string[];

  constructor(
    public translationsService: TranslationsService,
    private stageService: StageService,
    private dialog: MatDialog
  ) {
    this.dataLoaded = false;
    this.newStage = new Stage();
  }

  ngOnInit() {
    this.translationsService.getTranslations([
      'STAGESCOMPONENT.Alerts.stageAdded'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });
    this.stageService.getStagesList().subscribe(stages => {
      this.stages = stages;
      setTimeout(() => {
        this.dataLoaded = true;
      }, 300);
    });
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
              title: this.translations['STAGESCOMPONENT.Alerts.stageAdded'],
              type: 'success',
              timer: 1500
            }).then(() => {
              this.stages.push(stage);
            });
          },
          error => {
            swal({
              title: this.translationsService.globalTranslations['GLOBAL.PopUps.serverError'],
              type: 'error',
              timer: 1500
            });
          }
        );
      }
    });
  }

}

@Component({
  selector: 'add-stage-dialog',
  templateUrl: 'add-stage-dialog.html'
})
export class AddStageDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddStageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
