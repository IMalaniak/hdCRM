import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
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
}
