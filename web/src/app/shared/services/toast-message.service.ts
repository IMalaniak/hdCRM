import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MoleculesToastMessageComponent } from '../components/molecules';
import { ToastMessage } from '../models/toastMessage';
@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  constructor(private readonly _snackBar: MatSnackBar) {}

  snack(data: ToastMessage, duration = 5000): void {
    this._snackBar.openFromComponent(MoleculesToastMessageComponent, {
      data,
      duration,
      panelClass: 'p-0'
    });
  }
}
