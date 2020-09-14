import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoleculesServerMessageComponent } from '../components/molecules';
import { ApiResponse } from '../models';
import { DIALOG, ALERT } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  constructor(public snackBar: MatSnackBar) {}

  confirm(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: ALERT.QUESTION,
      showCancelButton: true,
      confirmButtonText: DIALOG.YES,
      cancelButtonText: DIALOG.CANCEL
    });
  }

  toast(title: string, icon: SweetAlertIcon = ALERT.SUCCESS, timer: number = 2500) {
    return Swal.fire({
      title,
      toast: true,
      icon,
      timer,
      showCancelButton: false,
      showCloseButton: false,
      showConfirmButton: false,
      position: 'bottom-end'
    });
  }

  popup(title: string, icon: SweetAlertIcon, timer: number = 2500) {
    return Swal.fire({
      title,
      icon,
      timer
    });
  }

  snack(serverResponse: ApiResponse, duration = 5000): void {
    this.snackBar.openFromComponent(MoleculesServerMessageComponent, {
      data: serverResponse,
      duration,
      panelClass: 'p-0'
    });
  }
}
