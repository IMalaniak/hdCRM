import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoleculesErrorMessageComponent } from '../components';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  constructor(public snackBar: MatSnackBar) {}

  confirm(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    });
  }

  toast(title: string, icon: SweetAlertIcon = 'success', timer: number = 2500) {
    return Swal.fire({
      title,
      toast: true,
      icon,
      timer,
      showCancelButton: false,
      showCloseButton: false,
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

  snack(serverResponse: ApiResponse, duration: number): void {
    this.snackBar.openFromComponent(MoleculesErrorMessageComponent, {
      data: serverResponse,
      duration,
      panelClass: 'p-0'
    });
  }
}
