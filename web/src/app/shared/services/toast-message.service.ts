import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MoleculesServerMessageComponent } from '../components/molecules';
import { ServiceMessage } from '../models';
@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  constructor(private readonly _snackBar: MatSnackBar) {}

  snack(serverResponse: ServiceMessage, duration = 5000): void {
    this._snackBar.openFromComponent(MoleculesServerMessageComponent, {
      data: serverResponse,
      duration,
      panelClass: 'p-0'
    });
  }
}
