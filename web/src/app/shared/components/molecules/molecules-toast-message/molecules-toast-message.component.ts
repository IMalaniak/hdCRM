import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { BS_ICONS, NOTIFICATION_TYPES } from '@/shared/constants';
import { ToastMessage } from '@/shared/models/toastMessage';

@Component({
  selector: 'molecules-toast-message',
  template: `
    <mat-card
      [ngClass]="{
        'success-message': toast.type === notificationTypes.SUCCESS,
        'failed-message': toast.type === notificationTypes.ERROR,
        'warn-message': toast.type === notificationTypes.WARN,
        'info-message': toast.type === notificationTypes.INFO
      }"
    >
      <mat-card-content class="d-flex flex-row align-items-center p-1">
        <mat-icon [svgIcon]="cardIcons[toast.type]" aria-hidden="false"></mat-icon>
        <div class="ml-3">
          <span>{{ toast.message }}</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./molecules-toast-message.component.scss']
})
export class MoleculesToastMessageComponent {
  notificationTypes = NOTIFICATION_TYPES;
  cardIcons: { [key: string]: BS_ICONS } = {
    [NOTIFICATION_TYPES.SUCCESS]: BS_ICONS.Check,
    [NOTIFICATION_TYPES.ERROR]: BS_ICONS.X,
    [NOTIFICATION_TYPES.INFO]: BS_ICONS.Info,
    [NOTIFICATION_TYPES.WARN]: BS_ICONS.Exclamation
  };
  constructor(@Inject(MAT_SNACK_BAR_DATA) public toast: ToastMessage) {}
}
