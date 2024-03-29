import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MoleculesToastMessageComponent } from '../components/molecules';
import { NOTIFICATION_TYPE } from '../constants';
import { ToastMessage } from '../models/toastMessage';
@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  constructor(private readonly _snackBar: MatSnackBar) {}

  /**
   * error
   *
   * @description Shows toast message with error type
   */
  public error(message: string) {
    this.snack({ message, type: NOTIFICATION_TYPE.ERROR });
  }

  /**
   * warn
   *
   * @description Shows toast message with warn type
   */
  public warn(message: string) {
    this.snack({ message, type: NOTIFICATION_TYPE.WARN });
  }

  /**
   * success
   *
   * @description Shows toast message with success type
   */
  public success(message: string) {
    this.snack({ message, type: NOTIFICATION_TYPE.SUCCESS });
  }

  /**
   * info
   *
   * @description Shows toast message with info type
   */
  public info(message: string) {
    this.snack({ message, type: NOTIFICATION_TYPE.INFO });
  }

  private snack(data: ToastMessage, duration = 5000): void {
    this._snackBar.openFromComponent(MoleculesToastMessageComponent, {
      data,
      duration,
      panelClass: 'p-0'
    });
  }
}
