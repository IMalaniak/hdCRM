import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { MoleculesServerMessageComponent } from '../components/molecules';
import { ApiResponse } from '../models';
@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  constructor(private readonly _snackBar: MatSnackBar) {}

  snack(serverResponse: ApiResponse, duration = 5000): void {
    const config: MatSnackBarConfig = {
      data: serverResponse,
      duration,
      panelClass: 'p-0'
    };
    this._snackBar.openFromComponent(MoleculesServerMessageComponent, config);
  }
}
