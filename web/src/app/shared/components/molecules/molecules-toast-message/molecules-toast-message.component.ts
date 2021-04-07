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
        'failed-message': toast.type === notificationTypes.ERROR
      }"
    >
      <mat-card-content class="d-flex flex-row align-items-center p-1">
        <mat-icon
          [svgIcon]="cardIcons[toast.type === notificationTypes.SUCCESS ? 'success' : 'failure']"
          aria-hidden="false"
        ></mat-icon>
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
    success: BS_ICONS.Check,
    failure: BS_ICONS.X
  };
  constructor(@Inject(MAT_SNACK_BAR_DATA) public toast: ToastMessage) {}
}
