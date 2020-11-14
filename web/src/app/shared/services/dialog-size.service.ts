import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

import { STYLECONSTANTS } from '../constants/style.constants';
import { DialogType } from '../models/dialog/dialog-type.enum';

@Injectable({
  providedIn: 'root'
})
export class DialogSizeService {
  protected config: MatDialogConfig;

  getSize(dialogType?: DialogType): MatDialogConfig {
    switch (dialogType) {
      case DialogType.CONFIRM:
        return (this.config = {
          width: '28em'
        });
      case DialogType.STANDART:
        return (this.config = {
          width: '32em'
        });
      default:
        return (this.config = {
          width: STYLECONSTANTS.FIT_CONTENT
        });
    }
  }
}
